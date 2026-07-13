import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LeadsService } from "@/modules/leads/services/LeadsService";
import { withTenantRequest } from "@/lib/tenant/withTenantRequest";

type RouteParams = {
  id: string;
};

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<RouteParams>;
  }
) {
  return withTenantRequest(req, async () => {
    const supabase = await createClient();
    const service = new LeadsService(supabase);

    const { id } = await params;

    return Response.json(await service.getLead(id));
  });
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<RouteParams>;
  }
) {
  return withTenantRequest(req, async () => {
    const supabase = await createClient();
    const service = new LeadsService(supabase);

    const body = await req.json();
    const { id } = await params;

    return Response.json(
      await service.updateLead(id, body)
    );
  });
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<RouteParams>;
  }
) {
  return withTenantRequest(req, async () => {
    const supabase = await createClient();
    const service = new LeadsService(supabase);

    const { id } = await params;

    await service.deleteLead(id);

    return Response.json({ success: true });
  });
}