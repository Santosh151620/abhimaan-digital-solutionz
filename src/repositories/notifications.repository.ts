import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/db/base-repository";
import type { Notification } from "@/types/notifications";

export class NotificationsRepository extends BaseRepository<Notification> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "notifications");
  }

  async findByEntity(
    entityType: string,
    entityId: string,
  ): Promise<Notification[]> {
    const { data, error } = await this.tableRef()
      .select("*")
      .eq("entityType", entityType)
      .eq("entityId", entityId)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return (data ?? []) as Notification[];
  }
}
