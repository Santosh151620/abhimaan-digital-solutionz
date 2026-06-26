import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  await supabase.auth.signOut();
  return Response.redirect("/login");
}