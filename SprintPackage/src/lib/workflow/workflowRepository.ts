import { createClient } from "@/lib/supabase/server";
import { TenantContextManager } from "@/lib/tenant/tenantContext";
import type { WorkflowTask } from "@/types/workflow";

/**
 * WorkflowRepository
 *
 * Tenant-aware repository for workflow tasks.
 * Every operation is scoped to the current organization.
 */
export class WorkflowRepository {
  private readonly table = "workflow_tasks";

  private get organizationId(): string {
    return TenantContextManager.get().organizationId;
  }

  async getTasks(): Promise<WorkflowTask[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("organization_id", this.organizationId)
      .order("dueAt", { ascending: true });

    if (error) {
      console.error("[WorkflowRepository.getTasks]", error);
      return [];
    }

    return (data ?? []) as WorkflowTask[];
  }

  async saveTasks(tasks: WorkflowTask[]): Promise<void> {
    if (tasks.length === 0) {
      return;
    }

    const supabase = await createClient();

    const payload = tasks.map((task) => ({
      ...task,
      organization_id: this.organizationId,
    }));

    const { error } = await supabase
      .from(this.table)
      .insert(payload);

    if (error) {
      console.error("[WorkflowRepository.saveTasks]", error);
    }
  }

  async updateTask(
    taskId: string,
    updates: Partial<WorkflowTask>
  ): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from(this.table)
      .update(updates)
      .eq("id", taskId)
      .eq("organization_id", this.organizationId);

    if (error) {
      console.error("[WorkflowRepository.updateTask]", error);
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq("id", taskId)
      .eq("organization_id", this.organizationId);

    if (error) {
      console.error("[WorkflowRepository.deleteTask]", error);
    }
  }

  async getTaskById(
    taskId: string
  ): Promise<WorkflowTask | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("id", taskId)
      .eq("organization_id", this.organizationId)
      .maybeSingle();

    if (error) {
      console.error("[WorkflowRepository.getTaskById]", error);
      return null;
    }

    return (data as WorkflowTask | null) ?? null;
  }
}
