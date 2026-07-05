"use client";

import { useMemo } from "react";

import type { EntityReference } from "@/types/base";

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
