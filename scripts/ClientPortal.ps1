$ErrorActionPreference = "Stop"

Write-Host "Generating CRM Client Portal Module..." -ForegroundColor Green


function Write-ProjectFile {

    param(
        [string]$Path,
        [string]$Content
    )


    $directory =
        Split-Path $Path -Parent


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
"src/types/crm/ClientPortal.ts" `
@'
export type ClientPortalStatus =
    | 'Active'
    | 'Inactive'
    | 'Pending'
    | 'Archived';



export interface ClientPortal {


    id:string;


    organizationId?:string;


    portalNumber:string;


    clientId?:string;


    name:string;


    email?:string;


    status:ClientPortalStatus;


    accessEnabled:boolean;


    entityType?:string;


    entityId?:string;


    isDeleted:boolean;


    deletedAt:string | null;


    deletedBy:string | null;


    createdAt:string;


    updatedAt:string;

}



export interface ClientPortalSummary {


    total:number;


    active:number;


    inactive:number;


    archived:number;

}
'@





Write-ProjectFile `
"src/repositories/crm/ClientPortalRepository.ts" `
@'
import type {
    ClientPortal,
    ClientPortalSummary,
} from '@/types/crm/ClientPortal';



class ClientPortalRepository {



    private clientPortals =
        new Map<string, ClientPortal>();





    async list():Promise<ClientPortal[]> {


        return Array.from(
            this.clientPortals.values()
        )
        .filter(
            portal =>
                !portal.isDeleted
        );

    }





    async listArchived():Promise<ClientPortal[]> {


        return Array.from(
            this.clientPortals.values()
        )
        .filter(
            portal =>
                portal.isDeleted
        );

    }





    async findById(
        id:string
    ):Promise<ClientPortal | null>{


        return (
            this.clientPortals.get(id)
            ??
            null
        );

    }





    async create(
        data:Partial<ClientPortal>
    ):Promise<ClientPortal>{


        const now =
            new Date()
            .toISOString();



        const portal:ClientPortal = {


            id:
                crypto.randomUUID(),



            organizationId:
                data.organizationId,



            portalNumber:
                data.portalNumber
                ??
                `CP-${Date.now()}`,



            clientId:
                data.clientId,



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



            isDeleted:false,



            deletedAt:null,



            deletedBy:null,



            createdAt:now,



            updatedAt:now,

        };



        this.clientPortals.set(
            portal.id,
            portal
        );



        return portal;

    }





    async update(
        id:string,
        data:Partial<ClientPortal>
    ):Promise<ClientPortal | null>{


        const existing =
            this.clientPortals.get(id);



        if(!existing){

            return null;

        }



        const updated:ClientPortal = {


            ...existing,


            ...data,


            updatedAt:
                new Date()
                .toISOString(),

        };



        this.clientPortals.set(
            id,
            updated
        );



        return updated;

    }





    async delete(
        id:string
    ):Promise<boolean>{


        const portal =
            this.clientPortals.get(id);



        if(!portal){

            return false;

        }



        portal.isDeleted = true;


        portal.status =
            'Archived';



        portal.deletedAt =
            new Date()
            .toISOString();



        portal.updatedAt =
            new Date()
            .toISOString();



        this.clientPortals.set(
            id,
            portal
        );



        return true;

    }
'@
Write-ProjectFile `
"src/repositories/crm/ClientPortalRepository.ts" `
@'
    async restore(
        id:string
    ):Promise<boolean>{


        const portal =
            this.clientPortals.get(id);



        if(!portal){

            return false;

        }



        portal.isDeleted = false;


        portal.deletedAt = null;


        portal.deletedBy = null;



        if(
            portal.status === 'Archived'
        ){

            portal.status =
                'Active';

        }



        portal.updatedAt =
            new Date()
            .toISOString();



        this.clientPortals.set(
            id,
            portal
        );



        return true;

    }





    async search(
        filters?: {

            status?: ClientPortal['status'];

            search?: string;

        }

    ):Promise<ClientPortal[]> {


        let portals =
            await this.list();




        if(filters?.status){


            portals =
                portals.filter(
                    portal =>
                        portal.status === filters.status
                );

        }





        if(filters?.search){


            const keyword =
                filters.search
                .toLowerCase();



            portals =
                portals.filter(
                    portal =>


                        portal.name
                        .toLowerCase()
                        .includes(keyword)


                        ||


                        portal.email
                        ?.toLowerCase()
                        .includes(keyword)


                );

        }



        return portals;

    }





    async summary():Promise<ClientPortalSummary>{


        const portals =
            await this.list();


        const archived =
            await this.listArchived();




        return {


            total:
                portals.length,



            active:
                portals.filter(
                    portal =>
                        portal.status === 'Active'
                )
                .length,



            inactive:
                portals.filter(
                    portal =>
                        portal.status === 'Inactive'
                )
                .length,



            archived:
                archived.length,


        };

    }



}





export const ClientPortalRepositoryInstance =
    new ClientPortalRepository();
'@





Write-ProjectFile `
"src/services/crm/ClientPortalService.ts" `
@'
import {
    ClientPortalRepositoryInstance,
} from '@/repositories/crm/ClientPortalRepository';



import type {
    ClientPortal,
    ClientPortalSummary,
} from '@/types/crm/ClientPortal';





class ClientPortalService {



    async list():Promise<ClientPortal[]> {


        return ClientPortalRepositoryInstance.list();

    }





    async listArchived():Promise<ClientPortal[]> {


        return ClientPortalRepositoryInstance.listArchived();

    }





    async findById(
        id:string
    ):Promise<ClientPortal | null>{


        return ClientPortalRepositoryInstance.findById(
            id
        );

    }





    async search(
        filters?:{

            status?:ClientPortal['status'];

            search?:string;

        }

    ):Promise<ClientPortal[]> {


        return ClientPortalRepositoryInstance.search(
            filters
        );

    }





    async create(
        data:Partial<ClientPortal>
    ):Promise<ClientPortal>{


        return ClientPortalRepositoryInstance.create(
            data
        );

    }





    async update(
        id:string,
        data:Partial<ClientPortal>
    ):Promise<ClientPortal | null>{


        return ClientPortalRepositoryInstance.update(
            id,
            data
        );

    }





    async delete(
        id:string
    ):Promise<boolean>{


        return ClientPortalRepositoryInstance.delete(
            id
        );

    }





    async restore(
        id:string
    ):Promise<boolean>{


        return ClientPortalRepositoryInstance.restore(
            id
        );

    }





    async summary():Promise<ClientPortalSummary>{


        return ClientPortalRepositoryInstance.summary();

    }



}





export const ClientPortalServiceInstance =
    new ClientPortalService();
'@
Write-ProjectFile `
"src/components/crm/client-portal/ClientPortalSummary.tsx" `
@'
import type {
    ClientPortalSummary,
} from '@/types/crm/ClientPortal';



export default function ClientPortalSummary({
    summary,
}:{
    summary:ClientPortalSummary;
}){


    return (

        <div className="grid grid-cols-4 gap-4">


            <div className="border p-4 rounded">
                <p>Total</p>
                <strong>{summary.total}</strong>
            </div>


            <div className="border p-4 rounded">
                <p>Active</p>
                <strong>{summary.active}</strong>
            </div>


            <div className="border p-4 rounded">
                <p>Inactive</p>
                <strong>{summary.inactive}</strong>
            </div>


            <div className="border p-4 rounded">
                <p>Archived</p>
                <strong>{summary.archived}</strong>
            </div>


        </div>

    );

}
'@





Write-ProjectFile `
"src/components/crm/client-portal/ClientPortalTable.tsx" `
@'
import type {
    ClientPortal,
} from '@/types/crm/ClientPortal';



export default function ClientPortalTable({
    portals,
}:{
    portals:ClientPortal[];
}){


    return (

        <table className="w-full border">


            <thead>

                <tr>

                    <th className="border p-2">
                        Name
                    </th>


                    <th className="border p-2">
                        Email
                    </th>


                    <th className="border p-2">
                        Status
                    </th>


                </tr>

            </thead>


            <tbody>


            {
                portals.map(
                    portal => (

                        <tr key={portal.id}>

                            <td className="border p-2">
                                {portal.name}
                            </td>


                            <td className="border p-2">
                                {portal.email}
                            </td>


                            <td className="border p-2">
                                {portal.status}
                            </td>

                        </tr>

                    )
                )
            }


            </tbody>


        </table>

    );

}
'@





Write-ProjectFile `
"src/components/crm/client-portal/ClientPortalForm.tsx" `
@'
'use client';


import {
    useState,
} from 'react';



export default function ClientPortalForm(){


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

                placeholder="Portal name"

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
"src/components/crm/client-portal/ClientPortalClient.tsx" `
@'
'use client';


import ClientPortalTable
from './ClientPortalTable';



import type {
    ClientPortal,
} from '@/types/crm/ClientPortal';



export default function ClientPortalClient({
    portals,
}:{
    portals:ClientPortal[];
}){


    return (

        <ClientPortalTable
            portals={portals}
        />

    );

}
'@





Write-ProjectFile `
"src/components/crm/client-portal/index.ts" `
@'
export { default as ClientPortalClient }
from './ClientPortalClient';


export { default as ClientPortalForm }
from './ClientPortalForm';


export { default as ClientPortalSummary }
from './ClientPortalSummary';


export { default as ClientPortalTable }
from './ClientPortalTable';
'@





Write-ProjectFile `
"src/app/crm/client-portal/actions.ts" `
@'
'use server';



import {
    ClientPortalServiceInstance,
} from '@/services/crm/ClientPortalService';



export async function createClientPortal(
    data:FormData
){


    return ClientPortalServiceInstance.create({

        name:
            String(
                data.get('name')
                ?? ''
            ),

    });

}
'@





Write-ProjectFile `
"src/app/crm/client-portal/page.tsx" `
@'
import {
    ClientPortalServiceInstance,
} from '@/services/crm/ClientPortalService';



import {
    ClientPortalClient,
    ClientPortalSummary,
} from '@/components/crm/client-portal';



export default async function ClientPortalPage(){


    const portals =
        await ClientPortalServiceInstance.list();



    const summary =
        await ClientPortalServiceInstance.summary();



    return (

        <div className="space-y-6">


            <ClientPortalSummary
                summary={summary}
            />


            <ClientPortalClient
                portals={portals}
            />


        </div>

    );

}
'@





Write-ProjectFile `
"src/app/crm/client-portal/new/page.tsx" `
@'
import {
    ClientPortalForm,
} from '@/components/crm/client-portal';



export default function NewClientPortalPage(){


    return (

        <ClientPortalForm />

    );

}
'@





Write-ProjectFile `
"src/app/crm/client-portal/[id]/page.tsx" `
@'
export default async function ClientPortalDetailsPage({
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
            Client Portal {id}
        </div>

    );

}
'@





Write-ProjectFile `
"src/app/crm/client-portal/[id]/edit/page.tsx" `
@'
import {
    ClientPortalForm,
} from '@/components/crm/client-portal';



export default function EditClientPortalPage(){


    return (

        <ClientPortalForm />

    );

}
'@





Write-Host ""
Write-Host "CRM Client Portal Module generation completed." -ForegroundColor Green