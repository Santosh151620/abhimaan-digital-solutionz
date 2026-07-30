import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";

import type {
    AdminUser,
} from "@/types/admin/User";



export interface IUsersRepository {

    list(): Promise<AdminUser[]>;

    active(): Promise<AdminUser[]>;

    pending(): Promise<AdminUser[]>;

    findById(
        id: string,
    ): Promise<AdminUser | null>;

    findByEmail(
        email: string,
    ): Promise<AdminUser | null>;

    save(
        user: AdminUser,
    ): Promise<void>;

    delete(
        id: string,
    ): Promise<void>;

}



export class UsersRepository
    extends BaseRepository<AdminUser>
    implements IUsersRepository {

    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "profiles",
        );

    }



    async list(): Promise<AdminUser[]> {

        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .eq(
                "organization_id",
                this.organizationId,
            )
            .order(
                "created_at",
                {
                    ascending: false,
                },
            );

        if (error) {
            throw error;
        }

        return (data ?? []) as AdminUser[];

    }



    async active(): Promise<AdminUser[]> {

        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .eq(
                "organization_id",
                this.organizationId,
            )
            .eq(
                "status",
                "Active",
            )
            .order(
                "full_name",
                {
                    ascending: true,
                },
            );

        if (error) {
            throw error;
        }

        return (data ?? []) as AdminUser[];

    }



    async pending(): Promise<AdminUser[]> {

        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .eq(
                "organization_id",
                this.organizationId,
            )
            .eq(
                "status",
                "Pending",
            )
            .order(
                "created_at",
                {
                    ascending: false,
                },
            );

        if (error) {
            throw error;
        }

        return (data ?? []) as AdminUser[];

    }



    async findById(
        id: string,
    ): Promise<AdminUser | null> {

        return super.findById(id);

    }



    async findByEmail(
        email: string,
    ): Promise<AdminUser | null> {

        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .eq(
                "organization_id",
                this.organizationId,
            )
            .ilike(
                "email",
                email,
            )
            .maybeSingle();

        if (error) {
            throw error;
        }

        return (data as AdminUser) ?? null;

    }



    async save(
        user: AdminUser,
    ): Promise<void> {

        const payload = {
            ...user,
            organization_id: this.organizationId,
        };

        const {
            error,
        } = await this
            .tableRef()
            .upsert(
                payload,
            );

        if (error) {
            throw error;
        }

    }



    async delete(
        id: string,
    ): Promise<void> {

        await super.delete(id);

    }

}