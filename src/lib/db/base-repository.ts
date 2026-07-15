import type { SupabaseClient } from "@supabase/supabase-js";
import { TenantContextManager } from "@/lib/tenant/tenantContext";

export abstract class BaseRepository<TEntity extends object> {
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

  /**
   * Adds tenant filter to query objects.
   * Safe helper for repositories building custom queries.
   */
  protected withTenant<T extends Record<string, unknown>>(query?: T) {
    return {
      ...(query ?? {}),
      organization_id: this.organizationId,
    };
  }

  /**
   * Inject tenant before inserts.
   */
  protected withCreateTenant<T extends Record<string, unknown>>(entity: T) {
    return {
      ...entity,
      organization_id: this.organizationId,
    };
  }

  /**
   * Prevent cross-tenant access.
   */
  protected validateOwnership(organizationId: string): void {
    if (organizationId !== this.organizationId) {
      throw new Error("Cross-tenant access denied.");
    }
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
      .insert(
        this.withCreateTenant(
          payload as Record<string, unknown>
        ) as Partial<TEntity> & { organization_id: string }
      )
      .select()
      .single();

    if (error) throw error;

    return data as TEntity;
  }

  async update(id: string, payload: Partial<TEntity>): Promise<TEntity> {
    const safePayload = payload as unknown as Record<string, unknown>;

    const { data, error } = await this.tableRef()
      .update(safePayload)
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




