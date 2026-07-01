import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { TenantContextManager } from "@/lib/tenant/tenantContext";

export abstract class BaseRepository<TEntity extends Record<string, unknown>> {
  protected readonly table: string;

  protected constructor(table: string) {
    this.table = table;
  }

  protected async db() {
    return createSupabaseServerClient();
  }

  protected organizationId(): string {
    return TenantContextManager.require().organizationId;
  }

  async findAll(): Promise<TEntity[]> {
    const db = await this.db();

    const { data, error } = await db
      .from(this.table)
      .select("*")
      .eq("organization_id", this.organizationId());

    if (error) throw error;

    return (data ?? []) as TEntity[];
  }

  async findById(id: string): Promise<TEntity | null> {
    const db = await this.db();

    const { data, error } = await db
      .from(this.table)
      .select("*")
      .eq("organization_id", this.organizationId())
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return (data as TEntity | null) ?? null;
  }

  async insert(
    payload: Partial<TEntity>
  ): Promise<TEntity> {
    const db = await this.db();

    const { data, error } = await db
      .from(this.table)
      .insert({
        ...payload,
        organization_id: this.organizationId(),
      })
      .select()
      .single();

    if (error) throw error;

    return data as TEntity;
  }

  async update(
    id: string,
    payload: Partial<TEntity>
  ): Promise<TEntity> {
    const db = await this.db();

    const { data, error } = await db
      .from(this.table)
      .update(payload as never)
      .eq("organization_id", this.organizationId())
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data as TEntity;
  }

  async delete(id: string): Promise<void> {
    const db = await this.db();

    const { error } = await db
      .from(this.table)
      .delete()
      .eq("organization_id", this.organizationId())
      .eq("id", id);

    if (error) throw error;
  }

  async exists(id: string): Promise<boolean> {
    const db = await this.db();

    const { data, error } = await db
      .from(this.table)
      .select("id")
      .eq("organization_id", this.organizationId())
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return data !== null;
  }

  async count(): Promise<number> {
    const db = await this.db();

    const { count, error } = await db
      .from(this.table)
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("organization_id", this.organizationId());

    if (error) throw error;

    return count ?? 0;
  }
}