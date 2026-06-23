import { supabase } from "@/lib/supabaseClient";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { data } = await supabase
    .from("lead_activity_timeline")
    .select("*")
    .eq("lead_id", params.id)
    .order("created_at", { ascending: false });

  return Response.json(data || []);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("lead_activity_timeline")
    .insert({
      lead_id: params.id,
      action: body.action,
      from_status: body.from_status,
      to_status: body.to_status,
    });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}