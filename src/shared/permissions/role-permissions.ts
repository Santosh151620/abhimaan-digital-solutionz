import type {
    Role,
} from "@/types/auth/role";


import type {
    Permission,
} from "@/shared/permissions";


import {
    PLATFORM_PERMISSIONS,
} from "./platform.permissions";


import {
    ADMIN_PERMISSIONS,
} from "./admin.permissions";


import {
    CRM_PERMISSIONS,
} from "./crm.permissions";



export const ROLE_PERMISSIONS: Record<
    Role,
    readonly Permission[]
> = {


    PLATFORM_OWNER: [

        ...PLATFORM_PERMISSIONS,

        ...ADMIN_PERMISSIONS,

        ...CRM_PERMISSIONS,

    ],



    PLATFORM_ADMIN: [

        ...PLATFORM_PERMISSIONS,

        ...ADMIN_PERMISSIONS,

    ],



    ORGANIZATION_ADMIN: [

        ...ADMIN_PERMISSIONS,

        ...CRM_PERMISSIONS,

    ],



    DEPARTMENT_ADMIN: [

        ...CRM_PERMISSIONS,

    ],



    TEAM_LEAD: [

        "leads.view",

        "companies.view",

        "contacts.view",

        "projects.view",

        "projects.update",

    ],



    USER: [

        "leads.view",

        "companies.view",

        "contacts.view",

        "projects.view",

    ],



    VIEWER: [

        "leads.view",

        "companies.view",

        "contacts.view",

    ],



    // Legacy CRM compatibility

    SUPER_ADMIN: [

        ...CRM_PERMISSIONS,

        ...ADMIN_PERMISSIONS,

    ],



    ADMIN: [

        ...CRM_PERMISSIONS,

        ...ADMIN_PERMISSIONS,

    ],



    MANAGER: [

        "projects.view",

        "projects.update",

        "companies.view",

        "contacts.view",

    ],


};