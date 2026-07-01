import { NextResponse } from 'next/server';
import { LeadsService } from '@/modules/leads/services/LeadsService';

const service = new LeadsService();

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ entityId: string }> }
) {
  const { entityId } = await params;

  const lead = await service.getLead(entityId);

  if (!lead) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(lead);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ entityId: string }> }
) {
  const { entityId } = await params;
  const body = await req.json();

  const updated = await service.updateLead({
    entityId,
    ...body,
  });

  return NextResponse.json(updated);
}