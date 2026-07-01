import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase-admin";

type RouteParams = {
  id: string;
};

type CreateNoteRequest = {
  note?: string;
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
      .from("lead_notes")
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
      notes: data ?? [],
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

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<RouteParams>;
  }
) {
  try {
    const { user } = await requireAdmin();

    const { id } = await params;

    const body: CreateNoteRequest = await req.json();

    const note = body.note?.trim() ?? "";

    if (!note) {
      return NextResponse.json(
        {
          success: false,
          error: "Note cannot be empty",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("lead_notes")
      .insert({
        lead_id: id,
        note,
        created_by: user.email,
      })
      .select()
      .single();

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

    await supabaseAdmin
      .from("lead_activity_timeline")
      .insert({
        lead_id: id,
        action: "note_added",
        created_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      note: data,
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