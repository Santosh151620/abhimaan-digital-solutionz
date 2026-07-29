import type {
    Permission,
} from "@/types/admin/Permission";

import type {
    IPermissionsRepository,
} from "@/repositories/admin/PermissionsRepository";

export class PermissionsService {

    constructor(
        private readonly repository: IPermissionsRepository,
    ) {}

    list(): Promise<Permission[]> {

        return this.repository.list();

    }

    findById(
        id: string,
    ): Promise<Permission | null> {

        return this.repository.findById(id);

    }

    findByKey(
        key: string,
    ): Promise<Permission | null> {

        return this.repository.findByKey(key);

    }

    save(
        permission: Permission,
    ): Promise<void> {

        return this.repository.save(permission);

    }

    delete(
        id: string,
    ): Promise<void> {

        return this.repository.delete(id);

    }

}
