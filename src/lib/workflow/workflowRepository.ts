import { createClient } from "@/lib/supabase/server";
import { WorkflowTask } from "@/types/workflow";
import { TenantContextManager } from "@/lib/tenant/tenantContext";

const supabase = await createClient();
/**
 * WorkflowRepository (TENANT-AWARE VERSION)
 *
 * Every query is scoped to organization_id.
 * This is mandatory for SaaS safety.
 */
export class WorkflowRepository {
  private table = "workflow_tasks";

  private get orgId(): string {
    return TenantContextManager.get().organizationId;
  }

  async getTasks(): Promise<WorkflowTask[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("organization_id", this.orgId);

    if (error) {
      console.error("[WorkflowRepository] getTasks error:", error);
      return [];
    }

    return (data ?? []) as WorkflowTask[];
  }

  async saveTasks(tasks: WorkflowTask[]): Promise<void> {
    const enriched = tasks.map((task) => ({
      ...task,
      organization_id: this.orgId,
    }));

    const { error } = await supabase
      .from(this.table)
      .insert(enriched);

    if (error) {
      console.error("[WorkflowRepository] saveTasks error:", error);
    }
  }

  async updateTask(
    taskId: string,
    updates: Partial<WorkflowTask>
  ): Promise<void> {
    const { error } = await supabase
      .from(this.table)
      .update(updates)
      .eq("id", taskId)
      .eq("organization_id", this.orgId);

    if (error) {
      console.error("[WorkflowRepository] updateTask error:", error);
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq("id", taskId)
      .eq("organization_id", this.orgId);

    if (error) {
      console.error("[WorkflowRepository] deleteTask error:", error);
    }
  }
}