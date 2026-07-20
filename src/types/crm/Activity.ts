export type ActivityType =

    | 'Created'

    | 'Updated'

    | 'Status Changed'

    | 'Deleted'

    | 'Restored';



export interface Activity {

    id:string;


    entityType:string;


    entityId:string;


    action:ActivityType;


    description:string;


    performedBy?:string;


    createdAt:string;

}