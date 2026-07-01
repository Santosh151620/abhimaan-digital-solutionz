import { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "./base.repository";
import type { Task } from "@/types/tasks";

export class TasksRepository extends BaseRepository<Task> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "tasks");
  }

  async findByEntity(
    entityType: string,
    entityId: string,
  ): Promise<Task[]> {
    const { data, error } = await this.query()
      .select("*")
      .eq("entityType", entityType)
      .eq("entityId", entityId)
      .order("createdAt", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as Task[];
  }
}