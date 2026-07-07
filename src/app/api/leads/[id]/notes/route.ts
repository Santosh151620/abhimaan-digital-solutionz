import { NextRequest, NextResponse } from "next/server";
import { withTenantRequest } from "@/lib/tenant/withTenantRequest";
import { requireAdmin } from "@/lib/requireAdmin";
import { getOrganizationId } from "@/lib/tenant/assertTenant";

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
  return withTenantRequest(req, async () => {
    try {
      await requireAdmin();

      const { id } = await params;
      const { supabase } = await requireAdmin();

      const { data, error } = await supabase
        .from("lead_notes")
        .select("*")
        .eq("lead_id", id)
        .eq("organization_id", getOrganizationId())
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
          },
          { status: 500 }
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
        { status: 401 }
      );
    }
  });
}

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<RouteParams>;
  }
) {
  return withTenantRequest(req, async () => {
    try {
      const { user, supabase } = await requireAdmin();

      const { id } = await params;
      const body: CreateNoteRequest = await req.json();

      const note = body.note?.trim() ?? "";

      if (!note) {
        return NextResponse.json(
          {
            success: false,
            error: "Note cannot be empty",
          },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
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
          { status: 500 }
        );
      }

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
        { status: 401 }
      );
    }
  });
}