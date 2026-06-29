import { WorkflowEngine } from "@/lib/workflow/workflowEngine";
import { WorkflowTask } from "@/types/workflow";

import { WorkflowRepository } from "@/lib/workflow/workflowRepository";
import { memoryCache } from "@/lib/cache/memoryCache";

export class TodayWorkService {
  private engine: WorkflowEngine;
  private repository: WorkflowRepository;

  constructor() {
    this.engine = new WorkflowEngine();
    this.repository = new WorkflowRepository();
  }

  /**
   * MAIN ENTRY POINT (NOW CACHED)
   */
  public async getTodayWork(): Promise<{
    tasks: WorkflowTask[];
    metrics: any;
  }> {
    const cacheKey = this.getCacheKey();

    const cached = memoryCache.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const storedTasks = await this.repository.getTasks();

    const result = this.engine.buildTodayWork(storedTasks);

    // Cache for 30 seconds (safe for CRM dashboards)
    memoryCache.set(cacheKey, result, 30 * 1000);

    return result;
  }

  /**
   * CACHE KEY (tenant-safe)
   */
  private getCacheKey(): string {
    // Later will include organization_id via TenantContext
    return `today_work:demo-org`;
  }
}