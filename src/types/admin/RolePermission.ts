/**
 * ============================================================================
 * ADS Enterprise Platform
 * Role Permission Mapping
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



export interface RolePermission
    extends BaseEntity {

    organizationId?: string;

    roleId: string;

    permissionId: string;

    permissionKey?: string;

    moduleName?: string;

    actionName?: string;

    assignedBy?: string;

    isSystem?: boolean;

    metadata?: Record<string, unknown>;

}