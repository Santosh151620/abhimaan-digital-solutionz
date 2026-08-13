import { memoryCache } from "@/lib/cache/memoryCache";

import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";

import {
    WorkflowEngine,
} from "@/lib/workflow/workflowEngine";

import {
    WorkflowRepository,
} from "@/lib/workflow/workflowRepository";

import type {
    WorkflowMetrics,
    WorkflowSummary,
    WorkflowTask,
} from "@/types/workflow";


interface TodayWorkResult {

    tasks:
        WorkflowTask[];

    metrics:
        WorkflowMetrics;

}


/**
 * TodayWorkService
 *
 * Builds the tenant-scoped, prioritized work queue
 * used by the CRM Today Work experience.
 *
 * Flow:
 *
 * Repository
 *     ↓
 * WorkflowEngine
 *     ↓
 * Memory Cache
 *     ↓
 * Dashboard / CRM
 *
 * Business rules remain inside WorkflowEngine.
 * Persistence remains inside WorkflowRepository.
 */
export class TodayWorkService {


    private readonly engine:
        WorkflowEngine;


    private readonly repository:
        WorkflowRepository;


    constructor() {

        this.engine =
            new WorkflowEngine();

        this.repository =
            new WorkflowRepository();

    }


    /**
     * Returns today's prioritized work
     * for the current organization.
     *
     * Results are cached per organization.
     */
    public async getTodayWork():
        Promise<TodayWorkResult> {

        const cacheKey =
            this.getCacheKey();


        const cached =
            memoryCache.get<TodayWorkResult>(
                cacheKey,
            );


        if (cached) {

            return cached;

        }


        const storedTasks =
            await this.repository.getTasks();


        const summary:
            WorkflowSummary =
            this.engine.buildTodayWork(
                storedTasks,
            );


        const result:
            TodayWorkResult = {

            tasks:
                summary.tasks,

            metrics:
                summary.metrics,

        };


        memoryCache.set(

            cacheKey,

            result,

            30_000,

        );


        return result;

    }


    /**
     * Invalidates the current organization's
     * Today Work cache.
     *
     * Call after workflow-task mutations.
     */
    public invalidateCache():
        void {

        const cacheKey =
            this.getCacheKey();


        memoryCache.delete(
            cacheKey,
        );

    }


    /**
     * Builds a tenant-scoped cache key.
     *
     * TenantContextManager is authoritative for
     * the current organization.
     */
    private getCacheKey():
        string {

        const organizationId =
            TenantContextManager
                .require()
                .organizationId;


        return [
            "today_work",
            organizationId,
        ].join(":");

    }

}