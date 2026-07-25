"use client";

import { useMemo } from "react";

import type { EntityReference } from "@/types/platform/Ownership";

export function useEntityReference(
  entityType: string,
  entityId: string,
): EntityReference {
  return useMemo(
    () => ({
      entityType,
      entityId,
    }),
    [entityType, entityId],
  );
}





