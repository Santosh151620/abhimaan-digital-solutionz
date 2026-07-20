import type {
    UserRole,
} from '@/types/crm/Permission';



export const CRM_ADMIN_ROLE: UserRole = {


    role:
        'CRM_ADMIN',



    permissions: [



        // TASK

        {
            module:
                'Task',

            action:
                'view',
        },


        {
            module:
                'Task',

            action:
                'create',
        },


        {
            module:
                'Task',

            action:
                'update',
        },


        {
            module:
                'Task',

            action:
                'delete',
        },




        // COMPANY

        {
            module:
                'Company',

            action:
                'view',
        },


        {
            module:
                'Company',

            action:
                'create',
        },


        {
            module:
                'Company',

            action:
                'update',
        },


        {
            module:
                'Company',

            action:
                'delete',
        },


    ],


};