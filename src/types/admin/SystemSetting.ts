/**
 * ============================================================================
 * System Settings
 * Enterprise Configuration Management
 * CRM + ERP Compatible
 * Production Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type SettingDataType =
    | "string"
    | "number"
    | "boolean"
    | "json";


export type SettingScope =
    | "System"
    | "Environment";


export interface SystemSetting extends BaseEntity {

    scope: SettingScope;


    category: string;


    key: string;


    name: string;


    description?: string;


    value: string;


    defaultValue?: string;


    dataType: SettingDataType;


    editable: boolean;


    encrypted: boolean;


    requiresRestart: boolean;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}
