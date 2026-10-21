export async function deleteEstimateWithAudit(supabase, { estimateId, confirmation, staffId }) {
  return supabase.rpc("delete_estimate_with_audit_v1", {
    p_estimate_id: estimateId,
    p_confirmation: confirmation,
    p_deleted_by: staffId,
  });
}

export async function listEstimateDeletionLog(supabase, { limit, offset }) {
  return supabase.from("estimate_deletion_log")
    .select("audit_id,estimate_id,estimate_number,estimate_date,customer_name,grand_total,deleted_by,deleted_at", { count: "exact" })
    .order("deleted_at", { ascending: false })
    .range(offset, offset + limit - 1);
}
