-- Preserve invoice units and use the ME/fiscal-year invoice numbering on existing projects.
alter table public.bill_items add column if not exists unit text not null default 'pcs';

-- Continue the existing ME/2026-27 invoice series after reference invoice 79.
select setval(
  'public.bill_number_seq',
  greatest(
    79,
    (select last_value from public.bill_number_seq),
    coalesce((select max(substring(bill_number from '([0-9]+)$')::bigint)
      from public.bills
      where invoice_date >= date '2026-04-01' and invoice_date < date '2027-04-01'), 0)
  ),
  true
);

-- Creates a bill and its line items as one database transaction, with idempotent retries.
create or replace function public.create_bill_v1(
  p_request_id uuid,
  p_bill_prefix text,
  p_customer_name text,
  p_customer_mobile text,
  p_customer_address text,
  p_tax_mode text,
  p_items jsonb,
  p_seller_snapshot jsonb,
  p_created_by text
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_existing public.bills%rowtype;
  v_bill public.bills%rowtype;
  v_item jsonb;
  v_line jsonb;
  v_lines jsonb := '[]'::jsonb;
  v_name text;
  v_hsn text;
  v_unit text;
  v_quantity numeric;
  v_price numeric;
  v_rate numeric;
  v_taxable numeric;
  v_tax numeric;
  v_cgst numeric;
  v_sgst numeric;
  v_igst numeric;
  v_subtotal numeric := 0;
  v_tax_total numeric := 0;
  v_grand_total numeric := 0;
  v_bill_number text;
  v_invoice_date date;
  v_fiscal_year_start integer;
  v_fiscal_year text;
  v_index integer := 0;
begin
  -- Serialize retries with the same request ID so only one invoice is ever created.
  perform pg_advisory_xact_lock(hashtextextended(p_request_id::text, 0));
  select * into v_existing from public.bills where request_id = p_request_id;
  if found then
    return jsonb_build_object(
      'bill', to_jsonb(v_existing),
      'items', coalesce((select jsonb_agg(to_jsonb(i) order by i.line_number) from public.bill_items i where i.bill_id = v_existing.id), '[]'::jsonb)
    );
  end if;

  if p_tax_mode not in ('none', 'intra', 'inter') then raise exception 'invalid_tax_mode'; end if;
  if coalesce(jsonb_typeof(p_items), '') <> 'array'
    or coalesce(jsonb_array_length(p_items), 0) < 1
    or coalesce(jsonb_array_length(p_items), 0) > 100 then
    raise exception 'invalid_items';
  end if;

  for v_item in select value from jsonb_array_elements(p_items) loop
    v_index := v_index + 1;
    v_name := nullif(trim(v_item->>'productName'), '');
    v_hsn := coalesce(trim(v_item->>'hsnSac'), '');
    v_unit := coalesce(nullif(trim(v_item->>'unit'), ''), 'pcs');
    v_quantity := coalesce(nullif(v_item->>'quantity', '')::numeric, 1);
    v_price := coalesce(nullif(v_item->>'unitPrice', '')::numeric, 0);
    v_rate := coalesce(nullif(v_item->>'gstRate', '')::numeric, 0);
    if v_name is null or length(v_unit) > 24 or v_quantity <= 0 or v_price < 0 or v_rate not in (0, 5, 12, 18, 28) then
      raise exception 'invalid_item';
    end if;
    if p_tax_mode = 'none' and v_rate > 0 then raise exception 'tax_mode_required'; end if;

    v_taxable := round(v_quantity * v_price, 2);
    v_tax := round(v_taxable * v_rate / 100, 2);
    v_cgst := case when p_tax_mode = 'intra' then round(v_tax / 2, 2) else 0 end;
    v_sgst := case when p_tax_mode = 'intra' then v_tax - v_cgst else 0 end;
    v_igst := case when p_tax_mode = 'inter' then v_tax else 0 end;
    v_lines := v_lines || jsonb_build_array(jsonb_build_object(
      'line_number', v_index, 'product_name', v_name, 'hsn_sac', v_hsn,
      'quantity', v_quantity, 'unit', v_unit, 'unit_price', v_price, 'gst_rate', v_rate,
      'taxable_amount', v_taxable, 'cgst_amount', v_cgst, 'sgst_amount', v_sgst,
      'igst_amount', v_igst, 'line_total', v_taxable + v_tax
    ));
    v_subtotal := v_subtotal + v_taxable;
    v_tax_total := v_tax_total + v_tax;
  end loop;

  v_grand_total := round(v_subtotal + v_tax_total, 2);
  v_invoice_date := (now() at time zone 'Asia/Kolkata')::date;
  v_fiscal_year_start := case when extract(month from v_invoice_date) >= 4 then extract(year from v_invoice_date)::integer else extract(year from v_invoice_date)::integer - 1 end;
  v_fiscal_year := v_fiscal_year_start::text || '-' || lpad(((v_fiscal_year_start + 1) % 100)::text, 2, '0');
  v_bill_number := upper(coalesce(nullif(trim(p_bill_prefix), ''), 'ME')) || '/' || v_fiscal_year || '/' || nextval('public.bill_number_seq')::text;

  insert into public.bills (
    request_id, bill_number, invoice_date, customer_name, customer_mobile,
    customer_address, tax_mode, subtotal, tax_total, grand_total, seller_snapshot, created_by
  ) values (
    p_request_id, v_bill_number, v_invoice_date, trim(p_customer_name), trim(p_customer_mobile),
    coalesce(trim(p_customer_address), ''), p_tax_mode, v_subtotal, v_tax_total,
    v_grand_total, coalesce(p_seller_snapshot, '{}'::jsonb), coalesce(p_created_by, '')
  ) returning * into v_bill;

  for v_line in select value from jsonb_array_elements(v_lines) loop
    insert into public.bill_items (
      bill_id, line_number, product_name, hsn_sac, quantity, unit, unit_price, gst_rate,
      taxable_amount, cgst_amount, sgst_amount, igst_amount, line_total
    ) values (
      v_bill.id, (v_line->>'line_number')::integer, v_line->>'product_name', v_line->>'hsn_sac',
      (v_line->>'quantity')::numeric, v_line->>'unit', (v_line->>'unit_price')::numeric, (v_line->>'gst_rate')::numeric,
      (v_line->>'taxable_amount')::numeric, (v_line->>'cgst_amount')::numeric,
      (v_line->>'sgst_amount')::numeric, (v_line->>'igst_amount')::numeric,
      (v_line->>'line_total')::numeric
    );
  end loop;

  return jsonb_build_object(
    'bill', to_jsonb(v_bill),
    'items', coalesce((select jsonb_agg(to_jsonb(i) order by i.line_number) from public.bill_items i where i.bill_id = v_bill.id), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.create_bill_v1(uuid, text, text, text, text, text, jsonb, jsonb, text) from public, anon, authenticated;
grant execute on function public.create_bill_v1(uuid, text, text, text, text, text, jsonb, jsonb, text) to service_role;
