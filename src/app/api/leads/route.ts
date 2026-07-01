import { NextResponse } from "next/server";
import { LeadsService } from "@/modules/leads/services/LeadsService";

const service = new LeadsService();

export async function GET(): Promise<NextResponse> {
  const data = await service.listLeads();
  return NextResponse.json(data);
}

export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.json();

  const created = await service.upsertLead({
    entityId: body.entityId,
    title: body.title,
    email: body.email,
    phone: body.phone,
    status: body.status,
    source: body.source,
    score: body.score,
  });

  return NextResponse.json(created);
}
