/**
 * ============================================================================
 * Ownership
 * ============================================================================
 */

export interface OwnedEntity {

    organizationId: string;

}

export interface UserOwned {

    userId: string;

}

export interface ModuleOwned {

    moduleCode: string;

}

export interface EntityReference {

    entityType: string;

    entityId: string;

}