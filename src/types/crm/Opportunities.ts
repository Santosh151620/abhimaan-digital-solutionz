export type OpportunityStage =
    | "LEAD"
    | "QUALIFIED"
    | "PROPOSAL"
    | "NEGOTIATION"
    | "WON"
    | "LOST";

export interface Opportunity {

    id: string;

    companyId?: string;
    contactId?: string;

    title: string;
    description?: string;

    value: number;
    probability: number;

    stage: OpportunityStage;

    expectedCloseDate?: string;

    owner?: string;

    isDeleted?: boolean;
    deletedAt?: string | null;
    deletedBy?: string | null;

    createdAt: string;
    updatedAt: string;

}

export interface OpportunityDetails
    extends Opportunity {

    companyName?: string;
    contactName?: string;

}