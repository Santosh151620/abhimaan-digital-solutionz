export type NoteEntityType =
    | 'Lead'
    | 'Company'
    | 'Contact'
    | 'Opportunity'
    | 'Project'
    | 'Task'
    | 'Activity'
    | 'Ticket'
    | 'Other';



export interface Note {

    id: string;

    entityType: NoteEntityType;

    entityId: string;

    title: string;

    content: string;

    createdBy?: string;

    archived: boolean;

    createdAt: string;

    updatedAt: string;

}