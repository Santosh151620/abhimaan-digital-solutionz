import type { SupabaseClient } from "@supabase/supabase-js";
import { TenantContextManager } from "@/lib/tenant/tenantContext";

export abstract class BaseRepository<
  TEntity extends Record<string, unknown>
> {
  protected readonly supabase: SupabaseClient;
  protected readonly table: string;

  constructor(supabase: SupabaseClient, table: string) {
    this.supabase = supabase;
    this.table = table;
  }

  protected get organizationId(): string {
    return TenantContextManager.require().organizationId;
  }

  protected tableRef() {
    return this.supabase.from(this.table);
  }

  async findById(id: string): Promise<TEntity | null> {
    const { data, error } = await this.tableRef()
      .select("*")
      .eq("organization_id", this.organizationId)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return (data as TEntity) ?? null;
  }

  async findAll(): Promise<TEntity[]> {
    const { data, error } = await this.tableRef()
      .select("*")
      .eq("organization_id", this.organizationId);

    if (error) throw error;

    return (data ?? []) as TEntity[];
  }

  async create(payload: Partial<TEntity>): Promise<TEntity> {
    const { data, error } = await this.tableRef()
      .insert({
        ...payload,
        organization_id: this.organizationId,
      } as Partial<TEntity> & { organization_id: string })
      .select()
      .single();

    if (error) throw error;

    return data as TEntity;
  }

  async update(id: string, payload: Partial<TEntity>): Promise<TEntity> {
    const { data, error } = await this.tableRef()
      .update(payload as Partial<TEntity> & { organization_id: string })
      .eq("organization_id", this.organizationId)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data as TEntity;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.tableRef()
      .delete()
      .eq("organization_id", this.organizationId)
      .eq("id", id);

    if (error) throw error;
  }
}