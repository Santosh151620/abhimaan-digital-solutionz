import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    // Verify logged-in admin
    await requireAdmin();

    const body = await req.json();

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

    // Fetch current status
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

    const oldStatus =
      existingLead?.status ?? "new";

    // Update lead
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

    // Timeline (optional)
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

    // Don't fail if timeline table doesn't exist
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
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          err?.message ??
          "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
}