import type {
    Role,
} from "@/types/auth/role";


export const ROLE_HIERARCHY: Record<Role, number> = {


    PLATFORM_OWNER: 100,

    PLATFORM_ADMIN: 90,


    ORGANIZATION_ADMIN: 80,

    DEPARTMENT_ADMIN: 70,

    TEAM_LEAD: 60,


    ADMIN: 55,

    MANAGER: 50,

    USER: 40,

    VIEWER: 10,


    SUPER_ADMIN: 110,

};