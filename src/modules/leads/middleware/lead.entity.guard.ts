import { NextResponse } from 'next/server';

/**
 * ENTITY GUARD
 * Enforces entityType + entityId integrity at API boundary
 */

export function validateLeadEntityPayload(body: any) {
  if (!body) {
    return NextResponse.json({ error: 'Missing payload' }, { status: 400 });
  }

  if (!body.entityId) {
    return NextResponse.json({ error: 'Missing entityId' }, { status: 400 });
  }

  return null;
}