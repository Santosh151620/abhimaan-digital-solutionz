import {
    PLATFORM_PERMISSIONS,
} from "./platform.permissions";


import {
    ADMIN_PERMISSIONS,
} from "./admin.permissions";


import {
    CRM_PERMISSIONS,
} from "./crm.permissions";


export {
    PLATFORM_PERMISSIONS,
    ADMIN_PERMISSIONS,
    CRM_PERMISSIONS,
};


export const PERMISSIONS = [

    ...PLATFORM_PERMISSIONS,

    ...ADMIN_PERMISSIONS,

    ...CRM_PERMISSIONS,

] as const;


export type Permission =
    typeof PERMISSIONS[number];


export const PERMISSION_SET =
    new Set<string>(
        PERMISSIONS,
    );


export * from "./role-governance";
export * from "./role-permissions";