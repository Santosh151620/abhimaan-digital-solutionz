export interface OrganizationSetting {

    id?: string;

    organization_id?: string;

    key: string;

    value?: unknown;

    title: string;

    description?: string;

    category?: string;

    type?:
        | "text"
        | "number"
        | "boolean"
        | "select"
        | "json";

    options?: unknown[];

    metadata?: Record<string, unknown>;

    created_at?: string;

    updated_at?: string;

}