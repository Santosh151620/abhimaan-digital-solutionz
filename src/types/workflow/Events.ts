export const WorkflowEvents = {

    LeadCreated: "lead.created",
    LeadUpdated: "lead.updated",
    LeadConverted: "lead.converted",
    LeadDeleted: "lead.deleted",

    CompanyCreated: "company.created",
    CompanyUpdated: "company.updated",
    CompanyDeleted: "company.deleted",

    ContactCreated: "contact.created",
    ContactUpdated: "contact.updated",
    ContactDeleted: "contact.deleted",

    OpportunityCreated: "opportunity.created",
    OpportunityUpdated: "opportunity.updated",
    OpportunityWon: "opportunity.won",
    OpportunityLost: "opportunity.lost",

    PipelineStageChanged: "pipeline.stage.changed",

    QuotationCreated: "quotation.created",
    QuotationSent: "quotation.sent",
    QuotationAccepted: "quotation.accepted",
    QuotationRejected: "quotation.rejected",

    ContractCreated: "contract.created",
    ContractSigned: "contract.signed",

    InvoiceCreated: "invoice.created",
    InvoicePaid: "invoice.paid",
    InvoiceCancelled: "invoice.cancelled",

    PaymentReceived: "payment.received",

    ProjectCreated: "project.created",
    ProjectUpdated: "project.updated",
    ProjectCompleted: "project.completed",

    TaskCreated: "task.created",
    TaskAssigned: "task.assigned",
    TaskCompleted: "task.completed",

    TicketCreated: "ticket.created",
    TicketAssigned: "ticket.assigned",
    TicketClosed: "ticket.closed",

    NoteAdded: "note.added",

    AttachmentUploaded: "attachment.uploaded",

    NotificationCreated: "notification.created",

    UserCreated: "user.created",

    UserUpdated: "user.updated",

    UserInvited: "user.invited",

    OrganizationCreated: "organization.created",

    OrganizationUpdated: "organization.updated"

} as const;

export type WorkflowEventName =
    typeof WorkflowEvents[keyof typeof WorkflowEvents];
