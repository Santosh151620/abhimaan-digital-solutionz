"use client";

import { useCallback, useEffect, useState } from "react";
import type { ActivityItem } from "../types/activity";

export function useActivity(entityType: string, entityId: string) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        entityType,
        entityId,
      });

      const response = await fetch(
        `/api/entities/activity?${params.toString()}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load activity.");
      }

      const result = await response.json();

      setActivities(result.data ?? []);
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
  }, [refresh]);

  return {
    activities,
    loading,
    refresh,
  };
}