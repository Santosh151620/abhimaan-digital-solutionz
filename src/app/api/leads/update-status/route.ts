import { createClient } from "@/lib/supabase/server";
import { LeadsService } from "@/modules/leads/services/LeadsService";

export async function POST(req: Request) {
  const supabase = await createClient();
  const service = new LeadsService(supabase);

  const body = await req.json();

  const updated = await service.updateStatus(
    body.id,
    body.status
  );

  return Response.json(updated);
}





