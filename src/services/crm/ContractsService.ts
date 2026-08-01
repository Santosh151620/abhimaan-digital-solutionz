import {
    createClient,
} from '@/lib/supabase/server';

import {
    createContractsRepository,
} from '@/repositories/crm/ContractsRepository';

import type {
    Contract,
    ContractSearchFilters,
    ContractStatus,
    ContractSummary,
} from '@/types/crm/Contracts';

class ContractsService {

    private async repository() {

        const supabase =
            await createClient();

        return createContractsRepository(
            supabase,
        );

    }

    async list(): Promise<Contract[]> {

        return (
            await this.repository()
        ).list();

    }

    async listArchived(): Promise<Contract[]> {

        return (
            await this.repository()
        ).listArchived();

    }

    async findById(
        id: string,
    ): Promise<Contract | null> {

        return (
            await this.repository()
        ).findById(
            id,
        );

    }

    async details(
        id: string,
    ): Promise<Contract | null> {

        return this.findById(
            id,
        );

    }

    async create(
        data: Partial<Contract>,
    ): Promise<Contract> {

        return (
            await this.repository()
        ).create(
            data,
        );

    }

    async update(
        id: string,
        data: Partial<Contract>,
    ): Promise<Contract> {

        return (
            await this.repository()
        ).update(
            id,
            {
                ...data,
                entityType:
                    'Contract',
            },
        );

    }

    async delete(
        id: string,
    ): Promise<void> {

        await (
            await this.repository()
        ).delete(
            id,
        );

    }

    async restore(
        id: string,
    ): Promise<Contract> {

        return (
            await this.repository()
        ).restore(
            id,
        );

    }

    async updateStatus(
        id: string,
        status: ContractStatus,
    ): Promise<Contract> {

        return (
            await this.repository()
        ).updateStatus(
            id,
            status,
        );

    }

    async search(
        filters?: ContractSearchFilters,
    ): Promise<Contract[]> {

        return (
            await this.repository()
        ).search(
            filters,
        );

    }

    async summary(): Promise<
        ContractSummary & {
            value: number;
        }
    > {

        const summary =
            await (
                await this.repository()
            ).summary();

        return {

            ...summary,

            /**
             * Backward compatibility
             */
            value:
                summary.totalValue,

        };

    }

}

export const contractsService =
    new ContractsService();

/**
 * Backward compatibility alias.
 */
export const ContractsServiceInstance =
    contractsService;

export const contractService =
    contractsService;
    