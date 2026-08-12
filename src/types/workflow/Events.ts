const WorkflowEvents = {


    EntityCreated:
        "entity.created",


    EntityUpdated:
        "entity.updated",


    EntityDeleted:
        "entity.deleted",


    EntityAssigned:
        "entity.assigned",


    EntityStatusChanged:
        "entity.status.changed",


    EntityCompleted:
        "entity.completed",


    EntityApproved:
        "entity.approved",


    EntityRejected:
        "entity.rejected",


    EntityPublished:
        "entity.published",


    EntityArchived:
        "entity.archived",


} as const;



export type WorkflowEventName =
    typeof WorkflowEvents[keyof typeof WorkflowEvents];