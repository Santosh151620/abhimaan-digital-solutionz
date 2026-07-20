import type {
    UserRole,
} from '@/types/crm/Permission';



export const CRM_ADMIN_ROLE:UserRole = {


    role:
        'CRM_ADMIN',



    permissions:[


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

    ],


};