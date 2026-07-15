import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  return NextResponse.json({
    success: true,
    status: "healthy",
    engine: "entity-platform",
  });
}





