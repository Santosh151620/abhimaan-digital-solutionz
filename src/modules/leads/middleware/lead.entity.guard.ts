import { NextResponse } from "next/server";

import {
  LEAD_ENTITY_TYPE,
  type LeadEntity,
} from "../types/lead.entity";

/**
 * Lead Entity Guard
 *
 * Validates every Lead payload entering the API layer.
 */

export function validateLeadEntityPayload(
  body: Partial<LeadEntity> | null | undefined
): NextResponse | null {
  if (!body) {
    return NextResponse.json(
      { error: "Missing request body." },
      { status: 400 }
    );
  }

  if (body.entityType !== LEAD_ENTITY_TYPE) {
    return NextResponse.json(
      { error: "Invalid entityType." },
      { status: 400 }
    );
  }

  if (
    typeof body.entityId !== "string" ||
    body.entityId.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "Missing entityId." },
      { status: 400 }
    );
  }

  if (
    typeof body.title !== "string" ||
    body.title.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "Missing title." },
      { status: 400 }
    );
  }

  return null;
}