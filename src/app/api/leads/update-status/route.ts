import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase-admin";

type UpdateStatusRequest = {
  leadId: string;
  status: string;
};

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body: UpdateStatusRequest = await req.json();

    const { leadId, status } = body;

    if (!leadId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing leadId or status",
        },
        {
          status: 400,
        }
      );
    }

    const { data: existingLead, error: fetchError } =
      await supabaseAdmin
        .from("leads")
        .select("status")
        .eq("id", leadId)
        .single();

    if (fetchError) {
      return NextResponse.json(
        {
          success: false,
          error: fetchError.message,
        },
        {
          status: 500,
        }
      );
    }

    const oldStatus = existingLead?.status ?? "new";

    const { error: updateError } =
      await supabaseAdmin
        .from("leads")
        .update({
          status,
        })
        .eq("id", leadId);

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          error: updateError.message,
        },
        {
          status: 500,
        }
      );
    }

    const { error: timelineError } =
      await supabaseAdmin
        .from("lead_activity_timeline")
        .insert({
          lead_id: leadId,
          action: "status_changed",
          from_status: oldStatus,
          to_status: status,
          created_at: new Date().toISOString(),
        });

    if (timelineError) {
      console.warn(
        "Timeline insert failed:",
        timelineError.message
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead updated successfully",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Unauthorized";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 401,
      }
    );
  }
}