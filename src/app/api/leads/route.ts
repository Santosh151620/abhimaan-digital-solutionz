import { createClient } from "@/lib/supabase/server";
import { LeadsService } from "@/modules/leads/services/LeadsService";

export async function GET() {
  const supabase = await createClient();
  const service = new LeadsService(supabase);

  const data = await service.listLeads();

  return Response.json(data);
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const service = new LeadsService(supabase);

  const body = await req.json();

  const created = await service.createLead(body);

  return Response.json(created);
}
