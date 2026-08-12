import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    BaseRepository,
} from "@/lib/db/base-repository";

import type {
    ExportJob,
    ImportExportSummary,
    ImportJob,
} from "@/types/crm/ImportExport";

class ImportExportRepository
    extends BaseRepository<ImportJob> {

    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "import_jobs",
        );

    }

    async listImports(): Promise<ImportJob[]> {

        const {
            data,
            error,
        } =
            await this.tableRef()
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

        return (
            data ?? []
        ) as ImportJob[];

    }

    async listExports(): Promise<ExportJob[]> {

        const {
            data,
            error,
        } =
            await this.supabase
                .from("export_jobs")
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

        return (
            data ?? []
        ) as ExportJob[];

    }

    async findImportById(
        id: string,
    ): Promise<ImportJob | null> {

        return super.findById(
            id,
        );

    }

    async findExportById(
        id: string,
    ): Promise<ExportJob | null> {

        const {
            data,
            error,
        } =
            await this.supabase
                .from("export_jobs")
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    id,
                )
                .maybeSingle();

        if (error) {

            throw error;

        }

        return (
            data as ExportJob
        ) ?? null;

    }
        async createImportJob(
        data: Partial<ImportJob>,
    ): Promise<ImportJob> {

        const now =
            new Date()
                .toISOString();

        return super.create(
            {
                ...data,

                startedAt:
                    data.startedAt ??
                    now,

                createdAt:
                    now,

                updatedAt:
                    now,
            },
        );

    }

    async createExportJob(
        data: Partial<ExportJob>,
    ): Promise<ExportJob> {

        const now =
            new Date()
                .toISOString();

        const {
            data: created,
            error,
        } =
            await this.supabase
                .from("export_jobs")
                .insert(
                    {
                        ...data,

                        organization_id:
                            this.organizationId,

                        started_at:
                            data.startedAt ??
                            now,

                        created_at:
                            now,

                        updated_at:
                            now,
                    },
                )
                .select()
                .single();

        if (error) {

            throw error;

        }

        return created as ExportJob;

    }

    async updateImportJob(
        id: string,
        data: Partial<ImportJob>,
    ): Promise<ImportJob> {

        return super.update(
            id,
            {
                ...data,

                updatedAt:
                    new Date()
                        .toISOString(),
            },
        );

    }

    async updateExportJob(
        id: string,
        data: Partial<ExportJob>,
    ): Promise<ExportJob> {

        const {
            data: updated,
            error,
        } =
            await this.supabase
                .from("export_jobs")
                .update(
                    {
                        ...data,

                        updated_at:
                            new Date()
                                .toISOString(),
                    },
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    id,
                )
                .select()
                .single();

        if (error) {

            throw error;

        }

        return updated as ExportJob;

    }

    async deleteImportJob(
        id: string,
    ): Promise<void> {

        await super.delete(
            id,
        );

    }

    async deleteExportJob(
        id: string,
    ): Promise<void> {

        const {
            error,
        } =
            await this.supabase
                .from("export_jobs")
                .delete()
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    id,
                );

        if (error) {

            throw error;

        }

    }
        async summary(): Promise<ImportExportSummary> {

        const imports =
            await this.listImports();

        const exports =
            await this.listExports();

        return {

            totalImports:
                imports.length,

            totalExports:
                exports.length,

            running:
                [
                    ...imports,
                    ...exports,
                ].filter(
                    item =>
                        item.status === "Running",
                ).length,

            completed:
                [
                    ...imports,
                    ...exports,
                ].filter(
                    item =>
                        item.status === "Completed",
                ).length,

            failed:
                [
                    ...imports,
                    ...exports,
                ].filter(
                    item =>
                        item.status === "Failed",
                ).length,

        };

    }

}

export function createImportExportRepository(
    supabase: SupabaseClient,
) {

    return new ImportExportRepository(
        supabase,
    );

}

const ImportExportRepositoryInstance = {

    listImports(
        ...args: unknown[]
    ) {

        void args;

        throw new Error(
            "ImportExportRepositoryInstance requires Supabase context. Use createImportExportRepository(supabase).listImports().",
        );

    },

    listExports(
        ...args: unknown[]
    ) {

        void args;

        throw new Error(
            "ImportExportRepositoryInstance requires Supabase context. Use createImportExportRepository(supabase).listExports().",
        );

    },

    createImportJob(
        ...args: unknown[]
    ) {

        void args;

        throw new Error(
            "ImportExportRepositoryInstance requires Supabase context. Use createImportExportRepository(supabase).createImportJob().",
        );

    },

    createExportJob(
        ...args: unknown[]
    ) {

        void args;

        throw new Error(
            "ImportExportRepositoryInstance requires Supabase context. Use createImportExportRepository(supabase).createExportJob().",
        );

    },

    summary(
        ...args: unknown[]
    ) {

        void args;

        throw new Error(
            "ImportExportRepositoryInstance requires Supabase context. Use createImportExportRepository(supabase).summary().",
        );

    },

};