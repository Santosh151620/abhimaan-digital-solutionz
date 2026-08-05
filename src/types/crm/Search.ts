/**
 * ============================================================
 * ADS CRM
 * Enterprise Search Types
 * ------------------------------------------------------------
 * Shared by:
 * - SearchRepository
 * - SearchService
 * - Search API
 * - Global Search
 * - Command Palette
 * - AI Copilot
 * ============================================================
 */

export type SearchEntityType =
    | "Lead"
    | "Company"
    | "Contact"
    | "Opportunity"
    | "Quotation"
    | "Contract"
    | "Invoice"
    | "Project"
    | "Task"
    | "Activity"
    | "Note"
    | "Attachment"
    | "Payment";

export interface SearchResult {

    /**
     * Internal database id
     */
    id: string;

    /**
     * Entity category
     */
    entityType: SearchEntityType;

    /**
     * Actual entity id
     */
    entityId: string;

    /**
     * Primary display title
     */
    title: string;

    /**
     * Secondary line
     */
    subtitle?: string;

    /**
     * Optional preview text
     */
    description?: string;

    /**
     * Route to open entity
     */
    url: string;

    /**
     * Optional icon name
     */
    icon?: string;

    /**
     * Relevance score
     * Higher = better match
     */
    score?: number;

    /**
     * Archived flag
     */
    archived?: boolean;

    /**
     * Created timestamp
     */
    createdAt?: string;

    /**
     * Updated timestamp
     */
    updatedAt?: string;

}

export interface SearchFilters {

    /**
     * Search keyword
     */
    query: string;

    /**
     * Restrict to one entity
     */
    entityType?: SearchEntityType;

    /**
     * Pagination
     */
    page?: number;

    pageSize?: number;

    limit?: number;

    offset?: number;

    /**
     * Sorting
     */
    sortBy?: string;

    sortDirection?: "asc" | "desc";

    /**
     * Include archived data
     */
    includeArchived?: boolean;

    /**
     * Entity switches
     */
    includeCompanies?: boolean;

    includeContacts?: boolean;

    includeLeads?: boolean;

    includeOpportunities?: boolean;

    includeProjects?: boolean;

    includeTasks?: boolean;

    includeActivities?: boolean;

    includeNotes?: boolean;

    includeAttachments?: boolean;

    includeQuotations?: boolean;

    includeContracts?: boolean;

    includeInvoices?: boolean;

    includePayments?: boolean;

}

export interface SearchResponse {

    /**
     * Search results
     */
    results: SearchResult[];

    /**
     * Total rows
     */
    total: number;

    /**
     * Current page
     */
    page: number;

    /**
     * Page size
     */
    pageSize: number;

    /**
     * More pages available
     */
    hasMore: boolean;

    /**
     * Search execution time
     */
    executionTimeMs?: number;

}