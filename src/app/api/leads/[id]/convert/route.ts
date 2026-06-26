import { NextRequest, NextResponse } from "next/server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await params;

    const supabase = await createSupabaseClient();

    // Get the lead
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: "Lead not found." },
        { status: 404 }
      );
    }

    if (lead.client_id) {
      return NextResponse.json(
        { error: "Lead has already been converted." },
        { status: 400 }
      );
    }

    // Create client
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .insert({
        full_name: lead.full_name,
        company_name: lead.company,
        email: lead.email,
        phone: lead.phone,
        status: "active",
        notes: null,
        converted_from_lead_id: lead.id,
      })
      .select()
      .single();

    if (clientError) {
      return NextResponse.json(
        { error: clientError.message },
        { status: 500 }
      );
    }

    // Update lead
    const { error: updateError } = await supabase
      .from("leads")
      .update({
        client_id: client.id,
        status: "won",
      })
      .eq("id", lead.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      client,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}