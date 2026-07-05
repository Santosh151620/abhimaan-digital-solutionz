import { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";
import type { Activity } from "@/types/activity";

export class ActivityRepository extends BaseRepository<Activity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "activities");
  }

  async findByEntity(
    entityType: string,
    entityId: string,
  ): Promise<Activity[]> {
    const { data, error } = await this.tableRef()
      .select("*")
      .eq("entityType", entityType)
      .eq("entityId", entityId)
      .order("createdAt", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as Activity[];
  }
}
