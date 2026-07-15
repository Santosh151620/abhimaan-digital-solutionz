import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LeadsService } from "@/modules/leads/services/LeadsService";
import { withTenantRequest } from "@/lib/tenant/withTenantRequest";

export async function GET(req: NextRequest) {
  return withTenantRequest(req, async () => {
    const supabase = await createClient();
    const service = new LeadsService(supabase);

    const data = await service.listLeads();

    return Response.json(data);
  });
}

export async function POST(req: NextRequest) {
  return withTenantRequest(req, async () => {
    const supabase = await createClient();
    const service = new LeadsService(supabase);

    const body = await req.json();

    const created = await service.createLead(body);

    return Response.json(created);
  });
}




