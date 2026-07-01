import type { SupabaseClient } from "@supabase/supabase-js";
import { TenantContextManager } from "@/lib/tenant/tenantContext";

export abstract class BaseRepository<
  TEntity extends Record<string, unknown>,
> {
  protected readonly supabase: SupabaseClient;
  protected readonly table: string;

  protected constructor(
    supabase: SupabaseClient,
    table: string,
  ) {
    this.supabase = supabase;
    this.table = table;
  }

  protected get organizationId(): string {
    return TenantContextManager.require().organizationId;
  }

  protected query() {
    return this.supabase
      .from(this.table)
      .eq("organization_id", this.organizationId);
  }

  async findAll(): Promise<TEntity[]> {
    const { data, error } = await this.query().select("*");

    if (error) throw error;

    return (data ?? []) as TEntity[];
  }

  async findById(id: string): Promise<TEntity | null> {
    const { data, error } = await this.query()
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return (data as TEntity | null) ?? null;
  }

  async create(payload: Partial<TEntity>): Promise<TEntity> {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert({
        ...payload,
        organization_id: this.organizationId,
      } as Record<string, unknown>)
      .select()
      .single();

    if (error) throw error;

    return data as TEntity;
  }

  async update(
    id: string,
    payload: Partial<TEntity>,
  ): Promise<TEntity> {
    const { data, error } = await this.query()
      .update(payload as Record<string, unknown>)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data as TEntity;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.query()
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async exists(id: string): Promise<boolean> {
    const { data, error } = await this.query()
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return data !== null;
  }

  async count(): Promise<number> {
    const { count, error } = await this.query().select("*", {
      count: "exact",
      head: true,
    });

    if (error) throw error;

    return count ?? 0;
  }
}