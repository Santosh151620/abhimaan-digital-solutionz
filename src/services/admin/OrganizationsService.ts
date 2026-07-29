import type {
    Organization,
} from "@/types/admin/Organization";

import { OrganizationsRepository } from "@/repositories/admin/OrganizationsRepository";

export class OrganizationsService {

    constructor(
        private readonly repository: OrganizationsRepository,
    ) {}

    async list(): Promise<Organization[]> {

        return this.repository.findAll();

    }

    async active(): Promise<Organization[]> {

        return this.repository.active();

    }

   async inactive(): Promise<Organization[]> {

    return this.repository.inactive();

}

    async get(
        id: string,
    ): Promise<Organization | null> {

        return this.repository.findById(
            id,
        );

    }

    async create(
        organization: Partial<Organization>,
    ): Promise<Organization> {

        return this.repository.create(
            organization,
        );

    }

    async update(
        id: string,
        organization: Partial<Organization>,
    ): Promise<Organization> {

        return this.repository.update(
            id,
            organization,
        );

    }

    async delete(
        id: string,
    ): Promise<void> {

        return this.repository.delete(
            id,
        );

    }

}
