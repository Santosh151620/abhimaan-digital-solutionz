import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TasksRepository } from "@/repositories/tasks.repository";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const repo = new TasksRepository(supabase);

  const entityType =
    req.nextUrl.searchParams.get("entityType");

  const entityId =
    req.nextUrl.searchParams.get("entityId");

  if (!entityType || !entityId) {
    return NextResponse.json(
      { error: "entityType and entityId required" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    await repo.findByEntity(entityType, entityId)
  );
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const repo = new TasksRepository(supabase);

  const body = await req.json();

  return NextResponse.json(
    await repo.create(body),
    { status: 201 }
  );
}




