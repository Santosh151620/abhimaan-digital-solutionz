/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 * Organizations Service
 *
 * Enterprise Organization Management
 * Application Layer
 *
 * Responsibilities
 * - Organization lifecycle
 * - Tenant administration
 * - Organization lookup
 * - Organization management
 * ============================================================================
 */

import type {
    Organization,
} from "@/types/admin/Organization";

import type {
    IOrganizationsRepository,
} from "@/repositories/admin/OrganizationsRepository";



export class OrganizationsService {

    constructor(
        private readonly repository: IOrganizationsRepository,
    ) {}



    async list(): Promise<Organization[]> {

        return this.repository.list();

    }



    async active(): Promise<Organization[]> {

        return this.repository.active();

    }



    async findById(
        id: string,
    ): Promise<Organization | null> {

        return this.repository.findById(id);

    }



    async findByCode(
        code: string,
    ): Promise<Organization | null> {

        return this.repository.findByCode(code);

    }



    async save(
        organization: Organization,
    ): Promise<void> {

        await this.repository.save(
            organization,
        );

    }



    async delete(
        id: string,
    ): Promise<void> {

        await this.repository.delete(
            id,
        );

    }

}