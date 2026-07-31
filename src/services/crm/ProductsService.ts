import {
    createClient,
} from '@/lib/supabase/server';


import {
    ProductsRepository,
} from '@/repositories/crm/ProductsRepository';


import type {
    Product,
    ProductSummary,
} from '@/types/crm/Products';



interface ProductSearchFilters {

    status?: Product['status'];

    type?: Product['type'];

    search?: string;

}

export class ProductsService {
    private async repository() {
        const supabase =
            await createClient();

        return new ProductsRepository(
            supabase
        );
    }

    async list(): Promise<Product[]> {
        const repository =
            await this.repository();
        return repository.list();
    }
    async listArchived(): Promise<Product[]> {
        const repository =
            await this.repository();
        return repository.listArchived();
    }
    async findById(
        id:string,
    ): Promise<Product | null> {
        const repository =
           await this.repository();
        return repository.findById(
            id
        );
    }
    async search(
        filters?: ProductSearchFilters
    ): Promise<Product[]> {


        const repository =
            await this.repository();



        return repository.search(
            filters
        );

    }




    async create(
        data:Partial<Product>,
    ): Promise<Product> {


        const repository =
            await this.repository();



        return repository.create(
            {

                ...data,

                entityType:
                    'Product',

            }
        );

    }




    async update(
        id:string,

        data:Partial<Product>

    ): Promise<Product> {


        const repository =
            await this.repository();



        return repository.update(

            id,

            {

                ...data,

                entityType:
                    'Product',

            }

        );

    }




    async delete(
        id:string
    ): Promise<void> {


        const repository =
            await this.repository();



        await repository.delete(
            id
        );

    }




    async restore(
        id:string
    ): Promise<boolean> {


        const repository =
            await this.repository();



        return repository.restore(
            id
        );

    }




    async summary(): Promise<ProductSummary> {


        const repository =
            await this.repository();



        return repository.summary();

    }


}




export const ProductsServiceInstance =
    new ProductsService();