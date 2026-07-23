export type SettingCategory =
    | 'General'
    | 'Company'
    | 'CRM'
    | 'Notifications'
    | 'Security'
    | 'Billing'
    | 'Email'
    | 'Integrations'
    | 'Appearance'
    | 'Other';

export type SettingStatus =
    | 'Active'
    | 'Inactive';

export interface Setting {

    id: string;

    settingNumber: string;

    companyId?: string;

    category: SettingCategory;

    key: string;

    name: string;

    description?: string;

    value: string;

    defaultValue?: string;

    status: SettingStatus;

    editable: boolean;

    encrypted: boolean;

    archived: boolean;

    createdAt: string;

    updatedAt: string;

}

export interface SettingsSummary {

    total: number;

    active: number;

    inactive: number;

    editable: number;

    encrypted: number;

}