import type {
    Role,
} from "@/types/auth/role";



interface RoleGovernance {


    role: Role;


    description: string;


    responsibilities: readonly string[];


}



const ROLE_GOVERNANCE:

Record<Role, RoleGovernance> = {


    PLATFORM_OWNER: {


        role:"PLATFORM_OWNER",


        description:
            "Ultimate platform authority",


        responsibilities:[

            "Manage platform configuration",

            "Manage organizations",

            "Manage platform administrators",

            "View global audit",

        ],

    },



    PLATFORM_ADMIN: {


        role:"PLATFORM_ADMIN",


        description:
            "Platform operations administrator",


        responsibilities:[

            "Manage platform settings",

            "Support organizations",

            "Manage system permissions",

        ],

    },



    ORGANIZATION_ADMIN: {


        role:"ORGANIZATION_ADMIN",


        description:
            "Organization administrator",


        responsibilities:[

            "Manage organization users",

            "Configure organization settings",

            "Manage CRM operations",

        ],

    },



    DEPARTMENT_ADMIN: {


        role:"DEPARTMENT_ADMIN",


        description:
            "Department administrator",


        responsibilities:[

            "Manage department users",

            "Manage department workflows",

        ],

    },



    TEAM_LEAD: {


        role:"TEAM_LEAD",


        description:
            "Team supervisor",


        responsibilities:[

            "Manage team activities",

            "Review team performance",

        ],

    },



    USER: {


        role:"USER",


        description:
            "Standard business user",


        responsibilities:[

            "Execute assigned business activities",

        ],

    },


VIEWER: {

    role:"VIEWER",

    description:
        "Read-only user",

    responsibilities:[

        "View permitted information",

    ],

},


SUPER_ADMIN: {

    role:"SUPER_ADMIN",

    description:
        "Legacy platform super administrator",

    responsibilities:[

        "Compatibility role",

        "Full administrative access",

    ],

},


ADMIN: {

    role:"ADMIN",

    description:
        "Legacy administrator role",

    responsibilities:[

        "Compatibility role",

        "Administrative operations",

    ],

},


MANAGER: {

    role:"MANAGER",

    description:
        "Legacy manager role",

    responsibilities:[

        "Compatibility role",

        "Team management",

    ],

},


};