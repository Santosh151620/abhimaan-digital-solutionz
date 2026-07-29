import type {
    Role,
} from "@/types/admin/Role";

import type {
    IRolesRepository,
} from "@/repositories/admin/RolesRepository";

export class RolesService {

    constructor(
        private readonly repository: IRolesRepository,
    ) {}

    list(): Promise<Role[]> {

        return this.repository.list();

    }

    findById(
        id: string,
    ): Promise<Role | null> {

        return this.repository.findById(id);

    }

    findByCode(
        code: string,
    ): Promise<Role | null> {

        return this.repository.findByCode(code);

    }

    save(
        role: Role,
    ): Promise<void> {

        return this.repository.save(role);

    }

    delete(
        id: string,
    ): Promise<void> {

        return this.repository.delete(id);

    }

}
