import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const formData = await req.formData();

  const id = formData.get("id") as string;
  const newStatus = formData.get("status") as string;

  if (!id || !newStatus) {
    return Response.json(
      { error: "Missing id or status" },
      { status: 400 }
    );
  }

  // Get current lead first (for from_status tracking)
  const { data: existing } = await supabase
    .from("leads")
    .select("status")
    .eq("id", id)
    .single();

  const oldStatus = existing?.status || "New";

  // Update lead status
  const { error: updateError } = await supabase
    .from("leads")
    .update({ status: newStatus })
    .eq("id", id);

  if (updateError) {
    return Response.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  // INSERT TIMELINE EVENT (IMPORTANT ADDITION)
  await supabase.from("lead_activity_timeline").insert({
    lead_id: id,
    action: "Status Updated",
    from_status: oldStatus,
    to_status: newStatus,
  });

  return Response.redirect(req.headers.get("referer") || "/");
}