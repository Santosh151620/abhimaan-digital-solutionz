/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 * Users Service
 *
 * Application service for:
 * - User Management
 * - Organization Users
 * - Identity Administration
 * - RBAC integration
 * ============================================================================
 */

import type {
    AdminUser,
} from "@/types/admin/User";

import type {
    IUsersRepository,
} from "@/repositories/admin/UsersRepository";



export class UsersService {

    constructor(
        private readonly repository: IUsersRepository,
    ) {}



    list(): Promise<AdminUser[]> {

        return this.repository.list();

    }



    active(): Promise<AdminUser[]> {

        return this.repository.active();

    }



    pending(): Promise<AdminUser[]> {

        return this.repository.pending();

    }



    findById(
        id: string,
    ): Promise<AdminUser | null> {

        return this.repository.findById(id);

    }



    findByEmail(
        email: string,
    ): Promise<AdminUser | null> {

        return this.repository.findByEmail(email);

    }



    async save(
        user: AdminUser,
    ): Promise<void> {

        await this.repository.save(user);

    }



    async delete(
        id: string,
    ): Promise<void> {

        await this.repository.delete(id);

    }

}