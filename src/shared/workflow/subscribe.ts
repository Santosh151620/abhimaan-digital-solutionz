/**
 * ============================================================================
 * ADS WORKFLOW SUBSCRIBE FACADE
 * ============================================================================
 *
 * Canonical shared entry point for subscribing to workflow events.
 *
 * Responsibilities:
 *
 * - Preserve the existing shared `subscribe()` contract.
 * - Delegate event registration to the canonical EventBus.
 * - Keep event-bus implementation details inside the workflow service layer.
 * - Provide a stable shared boundary for application modules.
 *
 * IMPORTANT:
 *
 * This facade must remain intentionally thin.
 *
 * It must NOT:
 *
 * - implement event dispatch;
 * - access the database;
 * - contain workflow business rules;
 * - bypass authorization or tenant isolation;
 * - duplicate EventBus behavior.
 * ============================================================================
 */

import type {
    WorkflowEventName,
} from "@/types/workflow/Events";


import type {
    WorkflowEventHandler,
} from "@/services/workflow/EventBus";


import {
    eventBus,
} from "@/services/workflow/EventBus";



/**
 * Subscribe a handler to a workflow event.
 *
 * EventBus remains responsible for:
 *
 * - handler registration;
 * - event dispatch;
 * - handler lifecycle;
 * - event delivery behavior.
 *
 * The returned value intentionally remains `void` to preserve the existing
 * shared API contract.
 */
export function subscribe(
    event: WorkflowEventName,
    handler: WorkflowEventHandler,
): void {

    eventBus.subscribe(
        event,
        handler,
    );

}