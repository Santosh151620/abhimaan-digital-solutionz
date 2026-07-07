"use client";

import { useCallback, useEffect, useState } from "react";
import { ActivityService } from "../services/ActivityService";
import type { Activity } from "../types/activity";

export function useActivity(entityType: string, entityId: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const data = await ActivityService.getByEntity(entityType, entityId);
      setActivities(data);
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