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
    v_quantity := coalesce(nullif(v_item->>'quantity', '')::numeric, 1);
    v_price := coalesce(nullif(v_item->>'unitPrice', '')::numeric, 0);
    v_rate := coalesce(nullif(v_item->>'gstRate', '')::numeric, 0);
    if v_name is null or v_quantity <= 0 or v_price < 0 or v_rate not in (0, 5, 12, 18, 28) then
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
      'quantity', v_quantity, 'unit_price', v_price, 'gst_rate', v_rate,
      'taxable_amount', v_taxable, 'cgst_amount', v_cgst, 'sgst_amount', v_sgst,
      'igst_amount', v_igst, 'line_total', v_taxable + v_tax
    ));
    v_subtotal := v_subtotal + v_taxable;
    v_tax_total := v_tax_total + v_tax;
  end loop;

  v_grand_total := round(v_subtotal + v_tax_total, 2);
  v_bill_number := upper(coalesce(nullif(trim(p_bill_prefix), ''), 'MSSU')) || '-' ||
    to_char((now() at time zone 'Asia/Kolkata')::date, 'YYYY') || '-' || lpad(nextval('public.bill_number_seq')::text, 6, '0');

  insert into public.bills (
    request_id, bill_number, invoice_date, customer_name, customer_mobile,
    customer_address, tax_mode, subtotal, tax_total, grand_total, seller_snapshot, created_by
  ) values (
    p_request_id, v_bill_number, (now() at time zone 'Asia/Kolkata')::date, trim(p_customer_name), trim(p_customer_mobile),
    coalesce(trim(p_customer_address), ''), p_tax_mode, v_subtotal, v_tax_total,
    v_grand_total, coalesce(p_seller_snapshot, '{}'::jsonb), coalesce(p_created_by, '')
  ) returning * into v_bill;

  for v_line in select value from jsonb_array_elements(v_lines) loop
    insert into public.bill_items (
      bill_id, line_number, product_name, hsn_sac, quantity, unit_price, gst_rate,
      taxable_amount, cgst_amount, sgst_amount, igst_amount, line_total
    ) values (
      v_bill.id, (v_line->>'line_number')::integer, v_line->>'product_name', v_line->>'hsn_sac',
      (v_line->>'quantity')::numeric, (v_line->>'unit_price')::numeric, (v_line->>'gst_rate')::numeric,
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

-- Search is parameterized and returns full bill rows with their line items.
create or replace function public.list_bills_v1(
  p_search text default null, p_from date default null, p_to date default null,
  p_limit integer default 50, p_offset integer default 0
) returns setof jsonb
language sql stable security definer set search_path = public, pg_temp as $$
  select to_jsonb(b) || jsonb_build_object(
    'items', coalesce(jsonb_agg(to_jsonb(i) order by i.line_number) filter (where i.id is not null), '[]'::jsonb)
  )
  from public.bills b left join public.bill_items i on i.bill_id = b.id
  where (p_from is null or b.invoice_date >= p_from)
    and (p_to is null or b.invoice_date <= p_to)
    and (nullif(trim(p_search), '') is null or b.bill_number ilike '%' || trim(p_search) || '%'
      or b.customer_name ilike '%' || trim(p_search) || '%' or b.customer_mobile ilike '%' || trim(p_search) || '%')
  group by b.id
  order by b.invoice_date desc, b.created_at desc
  limit least(greatest(coalesce(p_limit, 50), 1), 100) offset greatest(coalesce(p_offset, 0), 0);
$$;

-- Period summary is computed in PostgreSQL, so it covers every matching bill, not just one UI page.
create or replace function public.bill_report_v1(p_search text default null, p_from date default null, p_to date default null)
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'bill_count', count(*), 'subtotal', coalesce(sum(subtotal), 0),
    'tax_total', coalesce(sum(tax_total), 0), 'grand_total', coalesce(sum(grand_total), 0),
    'daily', coalesce((
      select jsonb_agg(jsonb_build_object('date', d.invoice_date, 'bill_count', d.bill_count, 'grand_total', d.grand_total) order by d.invoice_date)
      from (
        select invoice_date, count(*) as bill_count, sum(grand_total) as grand_total
        from public.bills
        where (p_from is null or invoice_date >= p_from) and (p_to is null or invoice_date <= p_to)
          and (nullif(trim(p_search), '') is null or bill_number ilike '%' || trim(p_search) || '%'
            or customer_name ilike '%' || trim(p_search) || '%' or customer_mobile ilike '%' || trim(p_search) || '%')
        group by invoice_date
      ) d
    ), '[]'::jsonb)
  )
  from public.bills
  where (p_from is null or invoice_date >= p_from) and (p_to is null or invoice_date <= p_to)
    and (nullif(trim(p_search), '') is null or bill_number ilike '%' || trim(p_search) || '%'
      or customer_name ilike '%' || trim(p_search) || '%' or customer_mobile ilike '%' || trim(p_search) || '%');
$$;

revoke all on function public.create_bill_v1(uuid, text, text, text, text, text, jsonb, jsonb, text) from public, anon, authenticated;
revoke all on function public.list_bills_v1(text, date, date, integer, integer) from public, anon, authenticated;
revoke all on function public.bill_report_v1(text, date, date) from public, anon, authenticated;
grant execute on function public.create_bill_v1(uuid, text, text, text, text, text, jsonb, jsonb, text) to service_role;
grant execute on function public.list_bills_v1(text, date, date, integer, integer) to service_role;
grant execute on function public.bill_report_v1(text, date, date) to service_role;
