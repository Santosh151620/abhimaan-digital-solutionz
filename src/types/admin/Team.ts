type TeamStatus =
    | "Active"
    | "Inactive";


export interface Team {

    id: string;


    organizationId?: string;


    departmentId?: string | null;


    teamCode: string;


    teamName: string;


    description?: string | null;


    teamLeadId?: string | null;


    status: TeamStatus;


    metadata?: Record<string, unknown>;


    createdAt?: string;


    updatedAt?: string;

}