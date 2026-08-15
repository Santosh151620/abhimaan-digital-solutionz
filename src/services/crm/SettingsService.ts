import {
    createSupabaseServerClient,
} from '@/lib/supabase/server-client';


import {
    SettingsRepository,
} from '@/repositories/crm/SettingsRepository';


import type {
    Setting,
    SettingStatus,
    SettingsSummary,
} from '@/types/crm/Settings';



/**
 * ============================================================================
 * ADS CRM — SETTINGS SERVICE
 * ============================================================================
 *
 * Application/service boundary for CRM settings.
 *
 * Responsibilities:
 *
 * - Create a request-scoped authenticated Supabase client.
 * - Create a request-scoped SettingsRepository.
 * - Expose the complete CRM settings application API.
 * - Preserve the canonical domain contracts from Settings.ts.
 *
 * Persistence responsibilities remain inside SettingsRepository.
 * Authorization/RLS responsibilities remain inside the authentication,
 * repository and database security layers.
 * ============================================================================
 */


class SettingsService {


    /**
     * Creates a fresh repository for the current request.
     *
     * The Supabase server client must not be converted into a global
     * singleton because authentication and tenant context are request-bound.
     */
    private async repository():
        Promise<SettingsRepository> {

        const supabase =
            await createSupabaseServerClient();


        return new SettingsRepository(
            supabase,
        );

    }



    /**
     * ------------------------------------------------------------------------
     * LIST
     * ------------------------------------------------------------------------
     *
     * Returns the current organization's settings.
     */
    async list():
        Promise<Setting[]> {

        const repository =
            await this.repository();


        return repository.list();

    }



    /**
     * ------------------------------------------------------------------------
     * LIST ARCHIVED
     * ------------------------------------------------------------------------
     *
     * Preserves the existing service contract.
     *
     * Whether archived records exist is determined by the repository's
     * persistence contract.
     */
    async listArchived():
        Promise<Setting[]> {

        const repository =
            await this.repository();


        return repository.listArchived();

    }



    /**
     * ------------------------------------------------------------------------
     * DETAILS
     * ------------------------------------------------------------------------
     *
     * Returns one setting for the current organization.
     */
    async details(
        id: string,
    ):
        Promise<Setting | null> {

        const repository =
            await this.repository();


        return repository.details(
            id,
        );

    }



    /**
     * ------------------------------------------------------------------------
     * CREATE
     * ------------------------------------------------------------------------
     *
     * Creates a new CRM setting.
     *
     * Domain validation and persistence normalization remain owned by the
     * repository/service-action layers.
     */
    async create(
        data: Partial<Setting>,
    ):
        Promise<Setting> {

        const repository =
            await this.repository();


        return repository.create(
            data,
        );

    }



    /**
     * ------------------------------------------------------------------------
     * UPDATE
     * ------------------------------------------------------------------------
     *
     * Updates an existing CRM setting.
     */
    async update(
        id: string,
        data: Partial<Setting>,
    ):
        Promise<Setting> {

        const repository =
            await this.repository();


        return repository.update(
            id,
            data,
        );

    }



    /**
     * ------------------------------------------------------------------------
     * STATUS
     * ------------------------------------------------------------------------
     *
     * Preserves the existing status service boundary.
     *
     * The repository remains responsible for enforcing the capabilities
     * supported by the current organization_settings persistence model.
     */
    async updateStatus(
        id: string,
        status: SettingStatus,
    ):
        Promise<Setting> {

        const repository =
            await this.repository();


        return repository.updateStatus(
            id,
            status,
        );

    }



    /**
     * ------------------------------------------------------------------------
     * DELETE
     * ------------------------------------------------------------------------
     *
     * Deletes a setting through the repository.
     */
    async delete(
        id: string,
    ):
        Promise<void> {

        const repository =
            await this.repository();


        await repository.delete(
            id,
        );

    }



    /**
     * ------------------------------------------------------------------------
     * RESTORE
     * ------------------------------------------------------------------------
     *
     * Preserves the existing restore service boundary.
     *
     * Repository behavior determines whether the current persistence
     * contract supports an actual restore operation.
     */
    async restore(
        id: string,
    ):
        Promise<boolean> {

        const repository =
            await this.repository();


        return repository.restore(
            id,
        );

    }



    /**
     * ------------------------------------------------------------------------
     * SUMMARY
     * ------------------------------------------------------------------------
     *
     * Returns the canonical SettingsSummary domain model.
     *
     * The repository MUST return all fields defined by
     * SettingsSummary:
     *
     * - total
     * - active
     * - inactive
     * - editable
     * - system
     * - encrypted
     * - categories
     */
    async summary():
        Promise<SettingsSummary> {

        const repository =
            await this.repository();


        return repository.summary();

    }

}



/**
 * ============================================================================
 * REQUEST-SAFE SERVICE FACADE
 * ============================================================================
 *
 * A fresh authenticated Supabase server client is created for every
 * repository operation.
 *
 * Do not replace this with a global Supabase client singleton.
 * ============================================================================
 */
export const SettingsServiceInstance =
    new SettingsService();
