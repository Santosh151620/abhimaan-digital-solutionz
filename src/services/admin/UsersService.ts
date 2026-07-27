import type {
    AdminUser,
} from "@/types/admin/User";

import { UsersRepository } from "@/repositories/admin/UsersRepository";

export class UsersService {

    constructor(
        private readonly repository: UsersRepository,
    ) {}

    async list(): Promise<AdminUser[]> {

        return this.repository.findAll();

    }

    async active(): Promise<AdminUser[]> {

        return this.repository.active();

    }

    async pending(): Promise<AdminUser[]> {

        return this.repository.pending();

    }

    async get(
        id: string,
    ): Promise<AdminUser | null> {

        return this.repository.findById(
            id,
        );

    }

    async create(
        user: Partial<AdminUser>,
    ): Promise<AdminUser> {

        return this.repository.create(
            user,
        );

    }

    async update(
        id: string,
        user: Partial<AdminUser>,
    ): Promise<AdminUser> {

        return this.repository.update(
            id,
            user,
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
