import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase-admin";

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
  try {
    await requireAdmin();

    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("lead_activity_timeline")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      timeline: data ?? [],
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
}