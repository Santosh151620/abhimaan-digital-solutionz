'use server';

import {
    CompaniesServiceInstance,
} from '@/services/crm/CompaniesService';

import type {
    CompanyDetails,
} from '@/types/crm/Companies';


export async function getCompanies() {
    return CompaniesServiceInstance.list();
}


export async function getArchivedCompanies() {
    return CompaniesServiceInstance.listArchived();
}


export async function getCompany(
    id: string
) {
    return CompaniesServiceInstance.details(id);
}


export async function createCompany(
    data: Partial<CompanyDetails>
) {
    return CompaniesServiceInstance.create(data);
}


export async function updateCompany(
    id: string,
    data: Partial<CompanyDetails>
) {
    return CompaniesServiceInstance.update(
        id,
        data
    );
}


export async function deleteCompany(
    id: string
) {
    return CompaniesServiceInstance.delete(id);
}


export async function restoreCompany(
    id: string
) {
    return CompaniesServiceInstance.restore(id);
}