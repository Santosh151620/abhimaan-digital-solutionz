Write-Host "Generating CRM Opportunities Module - Section 1/3..."

$root = "src"

# -----------------------------
# Types
# -----------------------------

$typePath = "$root/types/crm/Opportunities.ts"

@'
export type OpportunityStage =
    | 'New'
    | 'Qualified'
    | 'Proposal'
    | 'Negotiation'
    | 'Won'
    | 'Lost';


export type OpportunityPriority =
    | 'Low'
    | 'Medium'
    | 'High'
    | 'Critical';



export interface Opportunity {

    id:string;

    organizationId?:string;

    opportunityNumber:string;

    name:string;

    companyId?:string;

    contactId?:string;

    leadId?:string;

    stage:OpportunityStage;

    priority:OpportunityPriority;

    value:number;

    probability:number;

    expectedCloseDate?:string;

    description?:string;

    entityType?:string;

    entityId?:string;

    isDeleted:boolean;

    deletedAt:string | null;

    deletedBy:string | null;

    createdAt:string;

    updatedAt:string;

}



export interface OpportunitySummary {

    total:number;

    new:number;

    qualified:number;

    proposal:number;

    negotiation:number;

    won:number;

    lost:number;

    totalValue:number;

}
'@ | Set-Content $typePath -Encoding UTF8


Write-Host "Created: $typePath"



# -----------------------------
# Repository
# -----------------------------

$repoPath = "$root/repositories/crm/OpportunitiesRepository.ts"


@'
import type {
    Opportunity,
    OpportunitySummary,
} from '@/types/crm/Opportunities';



class OpportunitiesRepository {


    private opportunities =
        new Map<string, Opportunity>();



    async list():Promise<Opportunity[]> {

        return [
            ...this.opportunities.values()
        ];

    }



    async get(
        id:string
    ):Promise<Opportunity | null> {

        return this.opportunities.get(id) ?? null;

    }



    async create(
        opportunity:Opportunity
    ):Promise<Opportunity> {

        this.opportunities.set(
            opportunity.id,
            opportunity
        );

        return opportunity;

    }



    async update(
        id:string,
        data:Partial<Opportunity>
    ):Promise<Opportunity | null> {


        const existing =
            this.opportunities.get(id);


        if(!existing){

            return null;

        }


        const updated = {

            ...existing,

            ...data,

            updatedAt:
                new Date().toISOString()

        };


        this.opportunities.set(
            id,
            updated
        );


        return updated;

    }



    async remove(
        id:string
    ):Promise<boolean> {


        const opportunity =
            this.opportunities.get(id);


        if(!opportunity){

            return false;

        }


        opportunity.isDeleted = true;

        opportunity.deletedAt =
            new Date().toISOString();


        this.opportunities.set(
            id,
            opportunity
        );


        return true;

    }



    async restore(
        id:string
    ):Promise<boolean> {


        const opportunity =
            this.opportunities.get(id);


        if(!opportunity){

            return false;

        }


        opportunity.isDeleted = false;

        opportunity.deletedAt = null;

        opportunity.deletedBy = null;


        this.opportunities.set(
            id,
            opportunity
        );


        return true;

    }



    async search(
        filters?:{

            stage?:Opportunity['stage'];

            priority?:Opportunity['priority'];

            search?:string;

        }

    ):Promise<Opportunity[]> {


        let opportunities =
            await this.list();



        if(filters?.stage){

            opportunities =
                opportunities.filter(
                    item =>
                        item.stage === filters.stage
                );

        }



        if(filters?.priority){

            opportunities =
                opportunities.filter(
                    item =>
                        item.priority === filters.priority
                );

        }



        if(filters?.search){

            const value =
                filters.search.toLowerCase();


            opportunities =
                opportunities.filter(
                    item =>
                        item.name
                            .toLowerCase()
                            .includes(value)
                );

        }



        return opportunities;

    }



    async summary():Promise<OpportunitySummary>{


        const opportunities =
            await this.list();



        return {

            total:
                opportunities.length,


            new:
                opportunities.filter(
                    x=>x.stage==='New'
                ).length,


            qualified:
                opportunities.filter(
                    x=>x.stage==='Qualified'
                ).length,


            proposal:
                opportunities.filter(
                    x=>x.stage==='Proposal'
                ).length,


            negotiation:
                opportunities.filter(
                    x=>x.stage==='Negotiation'
                ).length,


            won:
                opportunities.filter(
                    x=>x.stage==='Won'
                ).length,


            lost:
                opportunities.filter(
                    x=>x.stage==='Lost'
                ).length,


            totalValue:
                opportunities.reduce(
                    (sum,item)=>
                        sum + item.value,
                    0
                )

        };

    }


}


export const opportunitiesRepository =
    new OpportunitiesRepository();
'@ | Set-Content $repoPath -Encoding UTF8


Write-Host "Created: $repoPath"

Write-Host "Section 1/3 completed."
Write-Host "Generating CRM Opportunities Module - Section 2/3..."

$root = "src"


# -----------------------------
# Service
# -----------------------------

$servicePath = "$root/services/crm/OpportunitiesService.ts"

@'
import {
    opportunitiesRepository,
} from '@/repositories/crm/OpportunitiesRepository';


import type {
    Opportunity,
    OpportunitySummary,
} from '@/types/crm/Opportunities';



class OpportunitiesService {


    async list():Promise<Opportunity[]> {

        return opportunitiesRepository.list();

    }



    async get(
        id:string
    ):Promise<Opportunity | null>{

        return opportunitiesRepository.get(id);

    }



    async create(
        opportunity:Opportunity
    ):Promise<Opportunity>{

        return opportunitiesRepository.create(
            opportunity
        );

    }



    async update(
        id:string,
        data:Partial<Opportunity>
    ):Promise<Opportunity | null>{

        return opportunitiesRepository.update(
            id,
            data
        );

    }



    async remove(
        id:string
    ):Promise<boolean>{

        return opportunitiesRepository.remove(id);

    }



    async restore(
        id:string
    ):Promise<boolean>{

        return opportunitiesRepository.restore(id);

    }



    async search(
        filters?:{
            stage?:Opportunity['stage'];
            priority?:Opportunity['priority'];
            search?:string;
        }

    ):Promise<Opportunity[]>{

        return opportunitiesRepository.search(
            filters
        );

    }



    async summary():Promise<OpportunitySummary>{

        return opportunitiesRepository.summary();

    }

}



export const opportunitiesService =
    new OpportunitiesService();
'@ | Set-Content $servicePath -Encoding UTF8


Write-Host "Created: $servicePath"



# -----------------------------
# Components Folder
# -----------------------------

$componentPath = "$root/components/crm/opportunities"

New-Item `
    -ItemType Directory `
    -Force `
    -Path $componentPath | Out-Null



# Summary

@'
import type {
    OpportunitySummary,
} from '@/types/crm/Opportunities';



export default function OpportunitiesSummary(
    {
        summary
    }:{
        summary:OpportunitySummary
    }

){

    return (

        <div className="grid grid-cols-4 gap-4">

            <div>
                Total: {summary.total}
            </div>

            <div>
                Won: {summary.won}
            </div>

            <div>
                Lost: {summary.lost}
            </div>

            <div>
                Value: {summary.totalValue}
            </div>

        </div>

    );

}
'@ | Set-Content "$componentPath/OpportunitiesSummary.tsx" -Encoding UTF8



# Form

@'
'use client';


import {
    useState
} from 'react';



export default function OpportunitiesForm(){

    const [name,setName] =
        useState('');



    return (

        <form className="space-y-4">

            <input
                className="border p-2 w-full"
                value={name}
                onChange={
                    e=>setName(e.target.value)
                }
                placeholder="Opportunity name"
            />


            <button
                type="submit"
                className="border px-4 py-2"
            >
                Save Opportunity
            </button>


        </form>

    );

}
'@ | Set-Content "$componentPath/OpportunitiesForm.tsx" -Encoding UTF8



# Table

@'
import type {
    Opportunity,
} from '@/types/crm/Opportunities';



export default function OpportunitiesTable(
    {
        opportunities
    }:{
        opportunities:Opportunity[]
    }

){

    return (

        <table className="w-full">

            <tbody>

            {
                opportunities.map(
                    item=>(

                        <tr key={item.id}>

                            <td>
                                {item.name}
                            </td>

                            <td>
                                {item.stage}
                            </td>

                        </tr>

                    )
                )
            }

            </tbody>

        </table>

    );

}
'@ | Set-Content "$componentPath/OpportunitiesTable.tsx" -Encoding UTF8



# Client

@'
'use client';


export default function OpportunitiesClient(){

    return (

        <div>

            Opportunities Client

        </div>

    );

}
'@ | Set-Content "$componentPath/OpportunitiesClient.tsx" -Encoding UTF8



# Index

@'
export { default as OpportunitiesClient }
from './OpportunitiesClient';


export { default as OpportunitiesForm }
from './OpportunitiesForm';


export { default as OpportunitiesSummary }
from './OpportunitiesSummary';


export { default as OpportunitiesTable }
from './OpportunitiesTable';
'@ | Set-Content "$componentPath/index.ts" -Encoding UTF8



Write-Host "Section 2/3 completed."
Write-Host "Generating CRM Opportunities Module - Section 3/3..."

$root = "src"



# -----------------------------
# App Folder
# -----------------------------

$appPath = "$root/app/crm/opportunities"

New-Item `
    -ItemType Directory `
    -Force `
    -Path "$appPath/new" | Out-Null


New-Item `
    -ItemType Directory `
    -Force `
    -Path "$appPath/[id]/edit" | Out-Null



# -----------------------------
# Actions
# -----------------------------

@'
'use server';


import {
    opportunitiesService,
} from '@/services/crm/OpportunitiesService';



export async function getOpportunities(){

    return opportunitiesService.list();

}



export async function getOpportunitySummary(){

    return opportunitiesService.summary();

}
'@ | Set-Content "$appPath/actions.ts" -Encoding UTF8




# -----------------------------
# Main Page
# -----------------------------

@'
import {
    getOpportunities,
    getOpportunitySummary,
} from './actions';


import {
    OpportunitiesSummary,
    OpportunitiesTable,
} from '@/components/crm/opportunities';



export default async function OpportunitiesPage(){


    const opportunities =
        await getOpportunities();


    const summary =
        await getOpportunitySummary();



    return (

        <div className="space-y-6">

            <h1 className="text-2xl font-semibold">
                Opportunities
            </h1>


            <OpportunitiesSummary
                summary={summary}
            />


            <OpportunitiesTable
                opportunities={opportunities}
            />


        </div>

    );

}
'@ | Set-Content "$appPath/page.tsx" -Encoding UTF8





# -----------------------------
# New Page
# -----------------------------

@'
import {
    OpportunitiesForm,
} from '@/components/crm/opportunities';



export default function NewOpportunityPage(){

    return (

        <div>

            <h1 className="text-xl font-semibold mb-4">
                New Opportunity
            </h1>


            <OpportunitiesForm />


        </div>

    );

}
'@ | Set-Content "$appPath/new/page.tsx" -Encoding UTF8





# -----------------------------
# Detail Page
# -----------------------------

@'
interface Props {

    params:Promise<{
        id:string;
    }>;

}



export default async function OpportunityPage(
    {
        params
    }:Props
){

    const {
        id
    } = await params;



    return (

        <div>

            Opportunity Details:
            {' '}
            {id}


        </div>

    );

}
$detailPath = Join-Path $appPath '[id]'
New-Item -ItemType Directory -Force -Path $detailPath | Out-Null

'@ | Set-Content (Join-Path $detailPath 'page.tsx')





# -----------------------------
# Edit Page
# -----------------------------

@'
interface Props {

    params:Promise<{
        id:string;
    }>;

}



export default async function EditOpportunityPage(
    {
        params
    }:Props
){

    const {
        id
    } = await params;



    return (

        <div>

            Edit Opportunity:
            {' '}
            {id}


        </div>

    );

}
$editPath = Join-Path $appPath '[id]\edit'
New-Item -ItemType Directory -Force -Path $editPath | Out-Null

'@ | Set-Content (Join-Path $editPath 'page.tsx')




Write-Host "CRM Opportunities Module generation completed."