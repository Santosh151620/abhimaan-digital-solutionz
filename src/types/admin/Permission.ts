/**
 * ============================================================================
 * Permission
 * ============================================================================
 */

export type PermissionAction =
    | 'View'
    | 'Create'
    | 'Update'
    | 'Delete'
    | 'Export'
    | 'Import'
    | 'Approve'
    | 'Manage';

export interface Permission {

    id: string;

    moduleId: string;

    name: string;

    code: string;

    action: PermissionAction;

    description?: string;

}

export interface PermissionGroup {

    moduleId: string;

    moduleName: string;

    permissions: Permission[];

}