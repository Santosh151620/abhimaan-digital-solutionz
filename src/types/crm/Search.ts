export type SearchEntityType =
    | 'Lead'
    | 'Company'
    | 'Contact'
    | 'Opportunity'
    | 'Quotation'
    | 'Contract'
    | 'Invoice'
    | 'Project'
    | 'Task'
    | 'Activity'
    | 'Note';

export interface SearchResult {

    id: string;

    entityType: SearchEntityType;

    entityId: string;

    title: string;

    subtitle?: string;

    description?: string;

    url: string;

}

export interface SearchFilters {

    query: string;

    entityType?: SearchEntityType;

}

export interface SearchResponse {

    results: SearchResult[];

    total: number;

}