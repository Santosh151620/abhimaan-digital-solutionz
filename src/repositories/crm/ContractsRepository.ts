import type {
    SupabaseClient,
} from '@supabase/supabase-js';

import {
    BaseRepository,
} from '@/lib/db/base-repository';

import type {
    Contract,
    ContractSearchFilters,
    ContractSummary,
    ContractStatus,
} from '@/types/crm/Contracts';


export class ContractsRepository
    extends BaseRepository<Contract> {


    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            'crm.contracts',
        );

    }



    async list(): Promise<Contract[]> {


        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'archived',
                    false,
                )
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );


        if (error) {

            throw error;

        }


        return (
            data ?? []
        ) as Contract[];

    }





    async listArchived(): Promise<Contract[]> {


        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'archived',
                    true,
                )
                .order(
                    'updated_at',
                    {
                        ascending: false,
                    },
                );


        if (error) {

            throw error;

        }


        return (
            data ?? []
        ) as Contract[];

    }





    async findById(
        id: string,
    ): Promise<Contract | null> {

        return super.findById(
            id,
        );

    }





    async details(
        id: string,
    ): Promise<Contract | null> {

        return this.findById(
            id,
        );

    }





    async create(
        data: Partial<Contract>,
    ): Promise<Contract> {


        const payload: Partial<Contract> = {

            ...data,

            entityType:
                'Contract',

            status:
                data.status
                ??
                'Draft',

            archived:
                false,

        };


        return super.create(
            payload,
        );

    }





    async update(
        id: string,

        data: Partial<Contract>,

    ): Promise<Contract> {


        return super.update(

            id,

            {

                ...data,

                entityType:
                    'Contract',

            },

        );

    }





    async updateStatus(
        id: string,

        status: ContractStatus,

    ): Promise<Contract> {


        return this.update(

            id,

            {

                status,

            },

        );

    }

async delete(
    id: string,
): Promise<void> {


    await this.update(

        id,

        {

            archived:
                true,

        },

    );

}

    async restore(
        id: string,
    ): Promise<Contract> {


        return this.update(

            id,

            {

                archived:
                    false,

            },

        );

    }





    async search(
        filters?: ContractSearchFilters,
    ): Promise<Contract[]> {


        let query =
            this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'archived',
                    false,
                );



        if (filters?.status) {

            query =
                query.eq(
                    'status',
                    filters.status,
                );

        }



        if (filters?.companyId) {

            query =
                query.eq(
                    'company_id',
                    filters.companyId,
                );

        }



        if (
            filters?.search &&
            filters.search.trim()
        ) {


            const keyword =
                filters.search.trim();



            query =
                query.or(

                    [

                        `title.ilike.%${keyword}%`,

                        `contract_number.ilike.%${keyword}%`,

                    ].join(','),

                );

        }



        const {
            data,
            error,
        } =
            await query.order(

                'created_at',

                {

                    ascending:
                        false,

                },

            );



        if (error) {

            throw error;

        }



        return (
            data ?? []
        ) as Contract[];

    }





    async summary(): Promise<ContractSummary> {


        const contracts =
            await this.list();



        const archived =
            await this.listArchived();



        const totalValue =
            contracts.reduce(

                (
                    total,
                    contract,
                ) =>

                    total +
                    (
                        contract.total ??
                        contract.value ??
                        0
                    ),

                0,

            );



        const activeValue =
            contracts

                .filter(

                    contract =>
                        contract.status ===
                        'Active',

                )

                .reduce(

                    (
                        total,
                        contract,
                    ) =>

                        total +
                        (
                            contract.total ??
                            contract.value ??
                            0
                        ),

                    0,

                );



        return {


            total:
                contracts.length,


            draft:
                contracts.filter(
                    x =>
                        x.status === 'Draft',
                ).length,


            pending:
                contracts.filter(
                    x =>
                        x.status === 'Pending',
                ).length,


            active:
                contracts.filter(
                    x =>
                        x.status === 'Active',
                ).length,


            completed:
                contracts.filter(
                    x =>
                        x.status === 'Completed',
                ).length,


            expired:
                contracts.filter(
                    x =>
                        x.status === 'Expired',
                ).length,


            terminated:
                contracts.filter(
                    x =>
                        x.status === 'Terminated',
                ).length,


            cancelled:
                contracts.filter(
                    x =>
                        x.status === 'Cancelled',
                ).length,


            archived:
                archived.length,


            totalValue,


            activeValue,

        };

    }


}





export function createContractsRepository(
    supabase: SupabaseClient,
) {


    return new ContractsRepository(
        supabase,
    );

}