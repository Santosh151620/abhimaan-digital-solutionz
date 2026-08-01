'use server';

import {
    ContractsServiceInstance,
} from '@/services/crm/ContractsService';

import type {
    Contract,
    ContractStatus,
} from '@/types/crm/Contracts';

export async function getContracts() {

    return await ContractsServiceInstance.list();

}

export async function getArchivedContracts() {

    return await ContractsServiceInstance.listArchived();

}

export async function getContract(
    id: string,
) {

    return await ContractsServiceInstance.details(
        id,
    );

}

export async function createContract(
    data: Partial<Contract>,
) {

    return await ContractsServiceInstance.create(
        data,
    );

}

export async function updateContract(
    id: string,
    data: Partial<Contract>,
) {

    return await ContractsServiceInstance.update(
        id,
        data,
    );

}

export async function deleteContract(
    id: string,
) {

    await ContractsServiceInstance.delete(
        id,
    );

}

export async function restoreContract(
    id: string,
) {

    return await ContractsServiceInstance.restore(
        id,
    );

}

export async function updateContractStatus(
    id: string,
    status: ContractStatus,
) {

    return await ContractsServiceInstance.updateStatus(
        id,
        status,
    );

}

export async function getContractsSummary() {

    return await ContractsServiceInstance.summary();

}