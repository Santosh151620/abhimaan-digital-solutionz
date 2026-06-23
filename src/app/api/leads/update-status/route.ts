import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    let id: string | null = null;
    let status: string | null = null;

    // Check if the incoming data is from a standard form or JSON
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      id = formData.get("id") as string;
      status = formData.get("status") as string;
    } else {
      const body = await req.json();
      id = body.id;
      status = body.status;
    }

    // Validation check
    if (!id || !status) {
      return NextResponse.json(
        { error: `Missing fields. Received id: ${id}, status: ${status}` },
        { status: 400 }
      );
    }

    // Update your Supabase database
    const { data, error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Crucial: Instead of showing raw JSON text, send the user back to the dashboard refreshed!
    return NextResponse.redirect(new URL('/en/dashboard/leads', req.url), 303);

  } catch (error: any) {
    console.error("CRASH ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
