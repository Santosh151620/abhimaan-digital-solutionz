'use server';


import {
    CompaniesServiceInstance,
} from '@/services/crm/CompaniesService';


import {
    PermissionServiceInstance,
} from '@/services/crm/PermissionService';


import {
    CRM_ADMIN_ROLE,
} from '@/shared/crmPermissions';


import type {
    Company,
    CompanyDetails,
} from '@/types/crm/Companies';



function can(

    action:

        | 'create'
        | 'update'
        | 'delete'

) {

    return PermissionServiceInstance.hasPermission(

        CRM_ADMIN_ROLE,

        'Company',

        action

    );

}





export async function getCompanies(){

    return CompaniesServiceInstance.list();

}





export async function searchCompanies(

    filters?:{

        status?: Company['status'];

        industry?: string;

        search?: string;

    }

){

    return CompaniesServiceInstance.search(
        filters
    );

}





export async function getArchivedCompanies(){

    return CompaniesServiceInstance.listArchived();

}





export async function getCompany(

    id:string

){

    return CompaniesServiceInstance.details(
        id
    );

}





export async function createCompany(

    data:Partial<CompanyDetails>

){

    if(
        !can('create')
    ){

        throw new Error(
            'Permission denied'
        );

    }



    return CompaniesServiceInstance.create(
        data
    );

}





export async function updateCompany(

    id:string,

    data:Partial<CompanyDetails>

){

    if(
        !can('update')
    ){

        throw new Error(
            'Permission denied'
        );

    }



    return CompaniesServiceInstance.update(

        id,

        data

    );

}





export async function deleteCompany(

    id:string

){

    if(
        !can('delete')
    ){

        throw new Error(
            'Permission denied'
        );

    }



    return CompaniesServiceInstance.delete(
        id
    );

}





export async function restoreCompany(

    id:string

){

    if(
        !can('update')
    ){

        throw new Error(
            'Permission denied'
        );

    }



    return CompaniesServiceInstance.restore(
        id
    );

}





export async function getCompaniesSummary(){

    return CompaniesServiceInstance.summary();

}