$ErrorActionPreference = "Stop"

Write-Host "Generating CRM Customer Portal Module..." -ForegroundColor Green


function Write-ProjectFile {

    param(
        [string]$Path,
        [string]$Content
    )


    $directory =
        Split-Path -Path $Path -Parent


    if (!(Test-Path -LiteralPath $directory)) {

        New-Item `
            -ItemType Directory `
            -Path $directory `
            -Force | Out-Null

    }


    Set-Content `
        -LiteralPath $Path `
        -Value $Content


    Write-Host "Created: $Path"

}





Write-ProjectFile `
"src/types/crm/CustomerPortal.ts" `
@'
export type CustomerPortalStatus =
    | 'Active'
    | 'Inactive'
    | 'Pending'
    | 'Archived';



export interface CustomerPortal {


    id:string;


    organizationId?:string;


    customerPortalNumber:string;


    customerId?:string;


    name:string;


    email?:string;


    status:CustomerPortalStatus;


    accessEnabled:boolean;


    entityType?:string;


    entityId?:string;


    isDeleted:boolean;


    deletedAt:string | null;


    deletedBy:string | null;


    createdAt:string;


    updatedAt:string;

}



export interface CustomerPortalSummary {


    total:number;


    active:number;


    inactive:number;


    archived:number;

}
'@






Write-ProjectFile `
"src/repositories/crm/CustomerPortalRepository.ts" `
@'
import type {
    CustomerPortal,
    CustomerPortalSummary,
} from '@/types/crm/CustomerPortal';



class CustomerPortalRepository {



    private customerPortals =
        new Map<string, CustomerPortal>();





    async list():Promise<CustomerPortal[]> {


        return Array.from(
            this.customerPortals.values()
        )
        .filter(
            portal =>
                !portal.isDeleted
        );

    }





    async listArchived():Promise<CustomerPortal[]> {


        return Array.from(
            this.customerPortals.values()
        )
        .filter(
            portal =>
                portal.isDeleted
        );

    }





    async findById(
        id:string
    ):Promise<CustomerPortal | null>{


        return (
            this.customerPortals.get(id)
            ??
            null
        );

    }





    async create(
        data:Partial<CustomerPortal>
    ):Promise<CustomerPortal>{


        const now =
            new Date()
            .toISOString();



        const portal:CustomerPortal = {


            id:
                crypto.randomUUID(),



            organizationId:
                data.organizationId,



            customerPortalNumber:
                data.customerPortalNumber
                ??
                `CUSTOMER-PORTAL-${Date.now()}`,



            customerId:
                data.customerId,



            name:
                data.name
                ??
                '',



            email:
                data.email,



            status:
                data.status
                ??
                'Pending',



            accessEnabled:
                data.accessEnabled
                ??
                false,



            entityType:
                data.entityType,



            entityId:
                data.entityId,



            isDeleted:
                false,



            deletedAt:
                null,



            deletedBy:
                null,



            createdAt:
                now,



            updatedAt:
                now,

        };



        this.customerPortals.set(
            portal.id,
            portal
        );



        return portal;

    }





    async update(
        id:string,
        data:Partial<CustomerPortal>
    ):Promise<CustomerPortal | null>{


        const existing =
            this.customerPortals.get(id);



        if(!existing){

            return null;

        }



        const updated:CustomerPortal = {


            ...existing,


            ...data,


            updatedAt:
                new Date()
                .toISOString(),

        };



        this.customerPortals.set(
            id,
            updated
        );



        return updated;

    }





    async delete(
        id:string
    ):Promise<boolean>{


        const portal =
            this.customerPortals.get(id);



        if(!portal){

            return false;

        }



        portal.isDeleted =
            true;



        portal.status =
            'Archived';



        portal.deletedAt =
            new Date()
            .toISOString();



        portal.updatedAt =
            new Date()
            .toISOString();



        this.customerPortals.set(
            id,
            portal
        );



        return true;

    }
'@
Write-ProjectFile `
"src/services/crm/CustomerPortalService.ts" `
@'
import {
    CustomerPortalRepositoryInstance,
} from '@/repositories/crm/CustomerPortalRepository';



import type {
    CustomerPortal,
    CustomerPortalSummary,
} from '@/types/crm/CustomerPortal';





class CustomerPortalService {



    async list():Promise<CustomerPortal[]> {

        return CustomerPortalRepositoryInstance.list();

    }





    async listArchived():Promise<CustomerPortal[]> {

        return CustomerPortalRepositoryInstance.listArchived();

    }





    async findById(
        id:string
    ):Promise<CustomerPortal | null>{

        return CustomerPortalRepositoryInstance.findById(
            id
        );

    }





    async create(
        data:Partial<CustomerPortal>
    ):Promise<CustomerPortal>{

        return CustomerPortalRepositoryInstance.create(
            data
        );

    }





    async update(
        id:string,
        data:Partial<CustomerPortal>
    ):Promise<CustomerPortal | null>{

        return CustomerPortalRepositoryInstance.update(
            id,
            data
        );

    }





    async delete(
        id:string
    ):Promise<boolean>{

        return CustomerPortalRepositoryInstance.delete(
            id
        );

    }





    async summary():Promise<CustomerPortalSummary>{

        return CustomerPortalRepositoryInstance.summary();

    }



}





export const CustomerPortalServiceInstance =
    new CustomerPortalService();
'@





Write-ProjectFile `
"src/components/crm/customer-portal/CustomerPortalSummary.tsx" `
@'
import type {
    CustomerPortalSummary,
} from '@/types/crm/CustomerPortal';



export default function CustomerPortalSummary({
    summary,
}:{
    summary:CustomerPortalSummary;
}){


    return (

        <div className="grid grid-cols-4 gap-4">


            <div className="border p-4">
                Total {summary.total}
            </div>


            <div className="border p-4">
                Active {summary.active}
            </div>


            <div className="border p-4">
                Inactive {summary.inactive}
            </div>


            <div className="border p-4">
                Archived {summary.archived}
            </div>


        </div>

    );

}
'@





Write-ProjectFile `
"src/components/crm/customer-portal/CustomerPortalTable.tsx" `
@'
import type {
    CustomerPortal,
} from '@/types/crm/CustomerPortal';



export default function CustomerPortalTable({
    portals,
}:{
    portals:CustomerPortal[];
}){


    return (

        <div>

        {
            portals.map(
                portal => (

                    <div
                        key={portal.id}
                        className="border p-2"
                    >

                        {portal.name}
                        -
                        {portal.status}

                    </div>

                )
            )
        }

        </div>

    );

}
'@





Write-ProjectFile `
"src/components/crm/customer-portal/CustomerPortalForm.tsx" `
@'
'use client';


import {
    useState,
} from 'react';



export default function CustomerPortalForm(){


    const [
        name,
        setName
    ] = useState('');



    return (

        <form className="space-y-4">


            <input

                className="border p-2 w-full"

                value={name}

                onChange={
                    event =>
                        setName(
                            event.target.value
                        )
                }

                placeholder="Customer Portal Name"

            />



            <button
                type="submit"
                className="border px-4 py-2"
            >

                Save

            </button>


        </form>

    );

}
'@





Write-ProjectFile `
"src/components/crm/customer-portal/CustomerPortalClient.tsx" `
@'
'use client';


import CustomerPortalTable
from './CustomerPortalTable';



import type {
    CustomerPortal,
} from '@/types/crm/CustomerPortal';



export default function CustomerPortalClient({
    portals,
}:{
    portals:CustomerPortal[];
}){


    return (

        <CustomerPortalTable
            portals={portals}
        />

    );

}
'@





Write-ProjectFile `
"src/components/crm/customer-portal/index.ts" `
@'
export { default as CustomerPortalClient }
from './CustomerPortalClient';


export { default as CustomerPortalForm }
from './CustomerPortalForm';


export { default as CustomerPortalSummary }
from './CustomerPortalSummary';


export { default as CustomerPortalTable }
from './CustomerPortalTable';
'@
id="s9c3kv"
Write-ProjectFile `
"src/app/crm/customer-portal/actions.ts" `
@'
'use server';


import {
    CustomerPortalServiceInstance,
} from '@/services/crm/CustomerPortalService';



export async function createCustomerPortal(
    data:FormData
){


    return CustomerPortalServiceInstance.create({

        name:
            String(
                data.get('name')
                ??
                ''
            ),

    });

}
'@





Write-ProjectFile `
"src/app/crm/customer-portal/page.tsx" `
@'
import {
    CustomerPortalServiceInstance,
} from '@/services/crm/CustomerPortalService';



import {
    CustomerPortalClient,
    CustomerPortalSummary,
} from '@/components/crm/customer-portal';



export default async function CustomerPortalPage(){


    const portals =
        await CustomerPortalServiceInstance.list();



    const summary =
        await CustomerPortalServiceInstance.summary();



    return (

        <div className="space-y-6">


            <CustomerPortalSummary
                summary={summary}
            />



            <CustomerPortalClient
                portals={portals}
            />


        </div>

    );

}
'@





Write-ProjectFile `
"src/app/crm/customer-portal/new/page.tsx" `
@'
import {
    CustomerPortalForm,
} from '@/components/crm/customer-portal';



export default function NewCustomerPortalPage(){


    return (

        <CustomerPortalForm />

    );

}
'@





Write-ProjectFile `
"src/app/crm/customer-portal/[id]/page.tsx" `
@'
export default async function CustomerPortalDetailsPage({

    params,

}:{

    params:Promise<{
        id:string;
    }>;

}){


    const {
        id,
    } = await params;



    return (

        <div>

            Customer Portal {id}

        </div>

    );

}
'@





Write-ProjectFile `
"src/app/crm/customer-portal/[id]/edit/page.tsx" `
@'
import {
    CustomerPortalForm,
} from '@/components/crm/customer-portal';



export default function EditCustomerPortalPage(){


    return (

        <CustomerPortalForm />

    );

}
'@





Write-Host ""

Write-Host "CRM Customer Portal Module generation completed." -ForegroundColor Green