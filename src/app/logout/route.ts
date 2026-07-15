import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  await supabase.auth.signOut();

  const { origin } = new URL(request.url);

  return NextResponse.redirect(new URL("/en/login", origin));
  return NextResponse.redirect(new URL("/hi/login", origin));
  return NextResponse.redirect(new URL("/kn/login", origin));
  return NextResponse.redirect(new URL("/mr/login", origin));
  return NextResponse.redirect(new URL("/te/login", origin));
}





