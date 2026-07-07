import { NextRequest, NextResponse } from "next/server";
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
    try {
      const supabase = await createClient();
      const service = new LeadsService(supabase);

      const { id } = await params;

      const timeline = await service.listTimeline(id);

      return NextResponse.json({
        success: true,
        timeline,
      });
    } catch (err: unknown) {
      return NextResponse.json(
        {
          success: false,
          error:
            err instanceof Error
              ? err.message
              : "Unable to load timeline",
        },
        {
          status: 500,
        }
      );
    }
  });
}