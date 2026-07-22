import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";
import type { Note } from "@/types/notes";

export class NotesRepository extends BaseRepository<Note> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "notes");
  }

  async findByEntity(
    entityType: string,
    entityId: string,
  ): Promise<Note[]> {
    const { data, error } = await this.tableRef()
      .select("*")
      .eq("entityType", entityType)
      .eq("entityId", entityId)
      .eq("organization_id", this.organizationId)
      .order("updatedAt", { ascending: false });

    if (error) throw error;

    return (data ?? []) as Note[];
  }
}




