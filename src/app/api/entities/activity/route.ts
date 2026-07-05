import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  return NextResponse.json({
    success: true,
    message: "Activity API is ready.",
  });
}

export async function POST(): Promise<Response> {
  return NextResponse.json(
    {
      success: true,
      message: "Activity API is ready.",
    },
    {
      status: 201,
    },
  );
}
