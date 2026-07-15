import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { NotesRepository } from "@/repositories/notes.repository";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const repo = new NotesRepository(supabase);

  const entityType = req.nextUrl.searchParams.get("entityType");
  const entityId = req.nextUrl.searchParams.get("entityId");

  if (!entityType || !entityId) {
    return NextResponse.json(
      { error: "entityType and entityId required" },
      { status: 400 }
    );
  }

  const data = await repo.findByEntity(
    entityType,
    entityId
  );

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const repo = new NotesRepository(supabase);

  const body = await req.json();

  const created = await repo.create(body);

  return NextResponse.json(created, {
    status: 201,
  });
}




