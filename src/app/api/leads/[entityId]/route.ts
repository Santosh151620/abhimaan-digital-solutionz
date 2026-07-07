import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LeadsService } from "@/modules/leads/services/LeadsService";
import { withTenantRequest } from "@/lib/tenant/withTenantRequest";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{ entityId: string }>;
  }
) {
  return withTenantRequest(req, async () => {
    const supabase = await createClient();
    const service = new LeadsService(supabase);

    const { entityId } = await context.params;

    return Response.json(await service.getLead(entityId));
  });
}

export async function PUT(
  req: NextRequest,
  context: {
    params: Promise<{ entityId: string }>;
  }
) {
  return withTenantRequest(req, async () => {
    const supabase = await createClient();
    const service = new LeadsService(supabase);

    const body = await req.json();
    const { entityId } = await context.params;

    return Response.json(
      await service.updateLead(entityId, body)
    );
  });
}

export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{ entityId: string }>;
  }
) {
  return withTenantRequest(req, async () => {
    const supabase = await createClient();
    const service = new LeadsService(supabase);

    const { entityId } = await context.params;

    await service.deleteLead(entityId);

    return Response.json({ success: true });
  });
}