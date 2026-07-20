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
        return ContractsRepositoryInstance.summary();
    }

}

export const ContractsServiceInstance =
    new ContractsService();