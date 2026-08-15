/**
 * ============================================================================
 * ADS WORKFLOW PUBLISH FACADE
 * ============================================================================
 *
 * Canonical shared entry point for publishing workflow events.
 *
 * Responsibilities:
 *
 * - Preserve the existing shared `publish()` contract.
 * - Delegate execution to the canonical WorkflowService.
 * - Keep workflow business rules inside the workflow service layer.
 * - Provide a stable boundary for server actions, services and other
 *   application modules.
 *
 * IMPORTANT:
 *
 * This facade must remain intentionally thin.
 *
 * It must NOT:
 *
 * - access the database directly;
 * - implement workflow rules;
 * - bypass authorization;
 * - construct tenant context;
 * - duplicate WorkflowService behavior.
 * ============================================================================
 */

import type {
    WorkflowContext,
} from "@/types/workflow/Workflow";


import type {
    WorkflowEventName,
} from "@/types/workflow/Events";


import {
    workflowService,
} from "@/services/workflow/WorkflowService";



/**
 * Publish a workflow event through the canonical workflow service.
 *
 * The WorkflowService remains responsible for:
 *
 * - workflow resolution;
 * - authorization;
 * - tenant/organization isolation;
 * - event dispatch;
 * - workflow execution;
 * - error handling and persistence.
 */
export async function publish(
    event: WorkflowEventName,
    context: WorkflowContext,
): Promise<void> {

    await workflowService.publish(
        event,
        context,
    );

}