/**
 * ADS Universal CRM Filter Engine
 *
 * Platform capability.
 *
 * This file contains only generic filtering contracts.
 * No module-specific business logic.
 */


export type FilterOperator =
    | "equals"
    | "not_equals"
    | "contains"
    | "starts_with"
    | "ends_with"
    | "greater_than"
    | "greater_than_or_equal"
    | "less_than"
    | "less_than_or_equal"
    | "between"
    | "in"
    | "not_in"
    | "is_empty"
    | "is_not_empty";


export type FilterValue =
    | string
    | number
    | boolean
    | Date
    | string[]
    | number[]
    | null;


export type FilterFieldType =
    | "text"
    | "number"
    | "boolean"
    | "date"
    | "datetime"
    | "select"
    | "multi_select";


export interface FilterCondition {

    id?: string;

    field: string;

    label?: string;

    type?: FilterFieldType;

    operator: FilterOperator;

    value: FilterValue;

}


export interface FilterGroup {

    id?: string;

    operator:

        | "AND"
        | "OR";


    conditions: FilterCondition[];

}


export interface FilterDefinition {

    id?: string;


    organizationId?: string;


    entityType: string;


    name?: string;


    description?: string;


    groups: FilterGroup[];


    isActive?: boolean;


    createdBy?: string;


    createdAt?: string;


    updatedAt?: string;

}


export interface SavedFilter {


    id: string;


    organizationId: string;


    entityType: string;


    name: string;


    filter: FilterDefinition;


    isDefault?: boolean;


    createdBy?: string;


    createdAt?: string;


    updatedAt?: string;

}


export interface FilterRequest {


    entityType: string;


    filter?: FilterDefinition;


    page?: number;


    pageSize?: number;

}


export interface FilterResponse<T> {


    data: T[];


    total: number;


    page: number;


    pageSize: number;


}