/**
 * ============================================================================
 * System Settings
 * ============================================================================
 */

export type SettingDataType =
    | "string"
    | "number"
    | "boolean"
    | "json";

export interface SystemSetting {

    id: string;

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

    createdAt: string;

    updatedAt?: string;

}