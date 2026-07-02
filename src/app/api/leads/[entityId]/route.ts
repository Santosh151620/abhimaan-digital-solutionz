import { createClient } from "@/lib/supabase/server";
import { LeadsService } from "@/modules/leads/services/LeadsService";

export async function GET(
  req: Request,
  context: {
    params: Promise<{
      entityId: string;
    }>;
  }
) {
  const supabase = await createClient();
  const service = new LeadsService(supabase);

  const { entityId } = await context.params;

  return Response.json(await service.getLead(entityId));
}

export async function PUT(
  req: Request,
  context: {
    params: Promise<{
      entityId: string;
    }>;
  }
) {
  const supabase = await createClient();
  const service = new LeadsService(supabase);

  const body = await req.json();

  const { entityId } = await context.params;
  const updated = await service.updateLead(entityId, body);

  return Response.json(updated);
}

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      entityId: string;
    }>;
  }
) {
  const supabase = await createClient();
  const service = new LeadsService(supabase);

  const { entityId } = await context.params;
  await service.deleteLead(entityId);

  return Response.json({ success: true });
}