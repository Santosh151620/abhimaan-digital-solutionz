export type NoteEntityType =
    | 'Lead'
    | 'Company'
    | 'Contact'
    | 'Opportunity'
    | 'Project'
    | 'Task'
    | 'Activity'
    | 'Ticket'
    | 'Quotation'
    | 'Invoice'
    | 'Contract'
    | 'Other';

export interface Note {

    id: string;

    organizationId?: string;

    entityType: NoteEntityType;

    entityId: string;

    title: string;

    content: string;

    createdBy?: string;

    archived: boolean;

    createdAt: string;

    updatedAt: string;

}

export interface NoteSummary {

    total: number;

    active: number;

    archived: number;

}
