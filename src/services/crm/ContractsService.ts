import {
    ContractsRepositoryInstance,
} from '@/repositories/crm/ContractsRepository';

import type {
    Contract,
    ContractSearchFilters,
    ContractStatus,
    ContractSummary,
} from '@/types/crm/Contracts';

class ContractsService {

    list(): Contract[] {

        return ContractsRepositoryInstance.list();

    }

    listArchived(): Contract[] {

        return ContractsRepositoryInstance.listArchived();

    }

    details(
        id: string,
    ): Contract | null {

        return ContractsRepositoryInstance.details(
            id,
        );

    }

    findById(
        id: string,
    ): Contract | null {

        return this.details(
            id,
        );

    }

    search(
        filters?: ContractSearchFilters,
    ): Contract[] {

        return ContractsRepositoryInstance.search(
            filters,
        );

    }

    create(
        data: Partial<Contract>,
    ): Contract {

        return ContractsRepositoryInstance.create(
            data,
        );

    }

    update(
        id: string,
        data: Partial<Contract>,
    ): Contract | null {

        return ContractsRepositoryInstance.update(
            id,
            data,
        );

    }

    updateStatus(
        id: string,
        status: ContractStatus,
    ): Contract | null {

        return ContractsRepositoryInstance.updateStatus(
            id,
            status,
        );

    }

    delete(
        id: string,
    ): boolean {

        return ContractsRepositoryInstance.delete(
            id,
        );

    }

    restore(
        id: string,
    ): boolean {

        return ContractsRepositoryInstance.restore(
            id,
        );

    }

    summary(): ContractSummary {

        return ContractsRepositoryInstance.summary();

    }

}

export async function createContractsService() {

    return new ContractsService();

}

export const ContractsServiceInstance =
    new ContractsService();

