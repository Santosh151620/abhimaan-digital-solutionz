import { memoryCache } from "@/lib/cache/memoryCache";
import { TenantContextManager } from "@/lib/tenant/tenantContext";
import { WorkflowEngine } from "@/lib/workflow/workflowEngine";
import { WorkflowRepository } from "@/lib/workflow/workflowRepository";

import type {
  WorkflowMetrics,
  WorkflowSummary,
  WorkflowTask,
} from "@/types/workflow";

interface TodayWorkResult {
  tasks: WorkflowTask[];
  metrics: WorkflowMetrics;
}

/**
 * TodayWorkService
 *
 * Builds today's prioritized work queue.
 *
 * Flow:
 * Repository
 *     â†“
 * WorkflowEngine
 *     â†“
 * Memory Cache
 *     â†“
 * Dashboard / CRM
 */
export class TodayWorkService {
  private readonly engine: WorkflowEngine;
  private readonly repository: WorkflowRepository;

  constructor() {
    this.engine = new WorkflowEngine();
    this.repository = new WorkflowRepository();
  }

  /**
   * Returns today's prioritized work.
   */
  public async getTodayWork(): Promise<TodayWorkResult> {
    const cacheKey = this.getCacheKey();

    const cached =
      memoryCache.get<TodayWorkResult>(cacheKey);

    if (cached) {
      return cached;
    }

    const storedTasks =
      await this.repository.getTasks();

    const summary: WorkflowSummary =
      this.engine.buildTodayWork(storedTasks);

    const result: TodayWorkResult = {
      tasks: summary.tasks,
      metrics: summary.metrics,
    };

    memoryCache.set(
      cacheKey,
      result,
      30_000
    );

    return result;
  }

  /**
   * Tenant-aware cache key.
   */
  private getCacheKey(): string {
    const tenant =
      TenantContextManager.get();

    return `today_work:${tenant.organizationId}`;
  }

  /**
   * Clears today's cache.
   * Call after task mutations.
   */
  public invalidateCache(): void {
    memoryCache.delete(this.getCacheKey());
  }
}
