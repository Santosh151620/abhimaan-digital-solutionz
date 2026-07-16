import { ContractsRepositoryInstance } from '@/repositories/crm/ContractsRepository';
import type {
    Contract,
    ContractStatus,
} from '@/types/crm/Contracts';

class ContractsService {

    list() {
        return ContractsRepositoryInstance.list();
    }

    listArchived() {
        return ContractsRepositoryInstance.listArchived();
    }

    details(id: string) {
        return ContractsRepositoryInstance.details(id);
    }

    create(data: Partial<Contract>) {
        return ContractsRepositoryInstance.create(data);
    }

    update(
        id: string,
        data: Partial<Contract>,
    ) {
        return ContractsRepositoryInstance.update(
            id,
            data,
        );
    }

    updateStatus(
        id: string,
        status: ContractStatus,
    ) {
        return ContractsRepositoryInstance.updateStatus(
            id,
            status,
        );
    }

    delete(id: string) {
        return ContractsRepositoryInstance.delete(id);
    }

    restore(id: string) {
        return ContractsRepositoryInstance.restore(id);
    }

    summary() {

        const contracts =
            ContractsRepositoryInstance.list();

        return {

            total: contracts.length,

            draft: contracts.filter(
                (c) => c.status === 'Draft'
            ).length,

            active: contracts.filter(
                (c) => c.status === 'Active'
            ).length,

            completed: contracts.filter(
                (c) => c.status === 'Expired'
            ).length,

            cancelled: contracts.filter(
                (c) => c.status === 'Cancelled'
            ).length,

            value: contracts.reduce(
                (sum, c) => sum + c.value,
                0,
            ),

        };

    }

}

export const ContractsServiceInstance =
    new ContractsService();