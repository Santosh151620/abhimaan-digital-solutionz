import type {
    UserRole,
} from '@/types/crm/Permission';

export const CRM_ADMIN_ROLE: UserRole = {

    role:
        'CRM_ADMIN',

    permissions: [

        // ACTIVITIES

        {
            module:
                'Activities',

            action:
                'view',
        },

        {
            module:
                'Activities',

            action:
                'create',
        },

        {
            module:
                'Activities',

            action:
                'update',
        },

        {
            module:
                'Activities',

            action:
                'delete',
        },

        // CALENDAR

        {
            module:
                'Calendar',

            action:
                'view',
        },

        {
            module:
                'Calendar',

            action:
                'create',
        },

        {
            module:
                'Calendar',

            action:
                'update',
        },

        {
            module:
                'Calendar',

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

        // CONTACTS

        {
            module:
                'Contacts',

            action:
                'view',
        },

        {
            module:
                'Contacts',

            action:
                'create',
        },

        {
            module:
                'Contacts',

            action:
                'update',
        },

        {
            module:
                'Contacts',

            action:
                'delete',
        },

        // KNOWLEDGE BASE

        {
            module:
                'Knowledge-Base',

            action:
                'view',
        },

        {
            module:
                'Knowledge-Base',

            action:
                'create',
        },

        {
            module:
                'Knowledge-Base',

            action:
                'update',
        },

        {
            module:
                'Knowledge-Base',

            action:
                'delete',
        },

        // PAYMENTS

        {
            module:
                'Payments',

            action:
                'view',
        },

        {
            module:
                'Payments',

            action:
                'create',
        },

        {
            module:
                'Payments',

            action:
                'update',
        },

        {
            module:
                'Payments',

            action:
                'delete',
        },

        // REPORTS

        {
            module:
                'Reports',

            action:
                'view',
        },

        {
            module:
                'Reports',

            action:
                'create',
        },

        {
            module:
                'Reports',

            action:
                'update',
        },

        {
            module:
                'Reports',

            action:
                'delete',
        },

        // SETTINGS

        {
            module:
                'Settings',

            action:
                'view',
        },

        {
            module:
                'Settings',

            action:
                'create',
        },

        {
            module:
                'Settings',

            action:
                'update',
        },

        {
            module:
                'Settings',

            action:
                'delete',
        },

        // TASKS

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
