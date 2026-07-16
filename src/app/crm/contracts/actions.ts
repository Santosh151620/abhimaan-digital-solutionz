'use server';

import {
    ContractsServiceInstance,
} from '@/services/crm/ContractsService';

import type {
    Contract,
    ContractStatus,
} from '@/types/crm/Contracts';

export async function getContracts() {
    return ContractsServiceInstance.list();
}

export async function getArchivedContracts() {
    return ContractsServiceInstance.listArchived();
}

export async function getContract(
    id: string
) {
    return ContractsServiceInstance.details(id);
}

export async function createContract(
    data: Partial<Contract>
) {
    return ContractsServiceInstance.create(data);
}

export async function updateContract(
    id: string,
    data: Partial<Contract>
) {
    return ContractsServiceInstance.update(
        id,
        data
    );
}

export async function deleteContract(
    id: string
) {
    return ContractsServiceInstance.delete(id);
}

export async function restoreContract(
    id: string
) {
    return ContractsServiceInstance.restore(id);
}

export async function updateContractStatus(
    id: string,
    status: ContractStatus
) {
    return ContractsServiceInstance.updateStatus(
        id,
        status
    );
}

export async function getContractsSummary() {
    return ContractsServiceInstance.summary();
}