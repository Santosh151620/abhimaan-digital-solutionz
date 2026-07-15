import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  return NextResponse.json({
    success: true,
    message: "Attachments API is ready.",
  });
}

export async function POST(): Promise<Response> {
  return NextResponse.json(
    {
      success: true,
      message: "Attachments API is ready.",
    },
    {
      status: 201,
    },
  );
}





