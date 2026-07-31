import type {
    SupabaseClient,
} from '@supabase/supabase-js';


import {
    BaseRepository,
} from '@/lib/db/base-repository';


import type {
    Product,
    ProductSummary,
} from '@/types/crm/Products';



interface ProductSearchFilters {

    status?: Product['status'];

    type?: Product['type'];

    search?: string;

}



export class ProductsRepository
    extends BaseRepository<Product> {


    constructor(
        supabase: SupabaseClient
    ) {

        super(
            supabase,
            'products'
        );

    }



    async list(): Promise<Product[]> {


        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId
                )
                .eq(
                    'is_deleted',
                    false
                )
                .order(
                    'created_at',
                    {
                        ascending: false,
                    }
                );



        if (error) {

            throw error;

        }



        return (
            data ?? []
        ) as Product[];

    }




    async listArchived(): Promise<Product[]> {


        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId
                )
                .eq(
                    'is_deleted',
                    true
                )
                .order(
                    'updated_at',
                    {
                        ascending: false,
                    }
                );



        if (error) {

            throw error;

        }



        return (
            data ?? []
        ) as Product[];

    }




    async findById(
        id: string
    ): Promise<Product | null> {


        return super.findById(
            id
        );

    }




    async create(
        data: Partial<Product>
    ): Promise<Product> {


        const payload: Partial<Product> = {


            ...data,


            status:
                data.status
                ??
                'Draft',


            type:
                data.type
                ??
                'Product',


            entityType:
                data.entityType
                ??
                'Product',


            isDeleted:
                false,


        };



        return super.create(
            payload
        );

    }




    async update(
        id: string,

        data: Partial<Product>

    ): Promise<Product> {



        return super.update(

            id,

            {

                ...data,

                entityType:
                    data.entityType
                    ??
                    'Product',

            }

        );


    }

    async delete(
        id: string
    ): Promise<void> {


        await this.update(

            id,

            {

                status:
                    'Archived',

                isDeleted:
                    true,

                deletedAt:
                    new Date()
                    .toISOString(),

            }

        );


    }

    async restore(
        id: string
    ): Promise<boolean> {


        const product =
            await this.findById(
                id
            );



        if (!product) {

            return false;

        }



        await this.update(

            id,

            {

                isDeleted:
                    false,


                deletedAt:
                    undefined,


                status:
                    'Active',

            }

        );



        return true;

    }




    async search(
        filters?: ProductSearchFilters

    ): Promise<Product[]> {



        let query =
            this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId
                )
                .eq(
                    'is_deleted',
                    false
                );




        if (filters?.status) {


            query =
                query.eq(

                    'status',

                    filters.status

                );


        }




        if (filters?.type) {


            query =
                query.eq(

                    'type',

                    filters.type

                );


        }




        if (filters?.search) {


            const keyword =
                filters.search.trim();



            if (keyword.length > 0) {


                query =
                    query.or(

                        [

                            `name.ilike.%${keyword}%`,

                            `sku.ilike.%${keyword}%`,

                            `product_number.ilike.%${keyword}%`,

                        ]

                        .join(',')

                    );


            }


        }





        const {
            data,
            error,
        } =
            await query
                .order(
                    'created_at',
                    {
                        ascending: false,
                    }
                );



        if (error) {

            throw error;

        }



        return (
            data ?? []
        ) as Product[];


    }





    async summary(): Promise<ProductSummary> {


        const products =
            await this.list();



        const archived =
            await this.listArchived();




        return {


            total:

                products.length,



            active:

                products.filter(

                    product =>

                        product.status === 'Active'

                )
                .length,



            inactive:

                products.filter(

                    product =>

                        product.status === 'Inactive'

                )
                .length,



            archived:

                archived.length,
        };
    }
}
