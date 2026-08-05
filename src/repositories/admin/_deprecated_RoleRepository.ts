import type {
    Role,
} from "@/types/auth/role";


export interface RoleRecord {

    id: string;

    name: Role;

    description?: string;

    createdAt?: string;

    updatedAt?: string;

}


class RoleRepository {


    async getAll(): Promise<RoleRecord[]> {

        return [];

    }


    async create(

        role: RoleRecord,

    ): Promise<RoleRecord> {

        return role;

    }


    async update(

        id: string,

        data: Partial<RoleRecord>,

    ): Promise<RoleRecord> {

        return {

            id,

            name:
                data.name ?? "USER",

            ...data,

        };

    }


    async delete(

        id: string,

    ): Promise<boolean> {

        return Boolean(id);

    }


}


export const RoleRepositoryInstance =
    new RoleRepository();
