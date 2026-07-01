import { SupabaseClient } from "@supabase/supabase-js";

export abstract class BaseRepository<TRecord extends object> {
  protected constructor(
    protected readonly supabase: SupabaseClient,
    protected readonly table: string,
  ) {}

  protected query() {
    return this.supabase.from(this.table);
  }

  async findById(id: string): Promise<TRecord | null> {
    const { data, error } = await this.query()
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data as TRecord;
  }

  async create(payload: Partial<TRecord>): Promise<TRecord> {
    const { data, error } = await this.query()
      .insert(payload as Record<string, unknown>)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as TRecord;
  }

  async update(
    id: string,
    payload: Partial<TRecord>,
  ): Promise<TRecord> {
    const { data, error } = await this.query()
      .update(payload as Record<string, unknown>)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as TRecord;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.query()
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }
}