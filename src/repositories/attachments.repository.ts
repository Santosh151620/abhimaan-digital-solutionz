import { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "./base.repository";
import type { Attachment } from "@/types/attachments";

export class AttachmentsRepository extends BaseRepository<Attachment> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "attachments");
  }

  async findByEntity(
    entityType: string,
    entityId: string,
  ): Promise<Attachment[]> {
    const { data, error } = await this.query()
      .select("*")
      .eq("entityType", entityType)
      .eq("entityId", entityId)
      .order("uploadedAt", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as Attachment[];
  }
}