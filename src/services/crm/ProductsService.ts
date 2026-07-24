import {
    ProductsRepositoryInstance,
} from '@/repositories/crm/ProductsRepository';



import type {
    Product,
    ProductSummary,
} from '@/types/crm/Products';





class ProductsService {



    async list():Promise<Product[]> {


        return ProductsRepositoryInstance.list();

    }





    async listArchived():Promise<Product[]> {


        return ProductsRepositoryInstance.listArchived();

    }





    async findById(
        id:string
    ):Promise<Product | null>{


        return ProductsRepositoryInstance.findById(
            id
        );

    }





    async search(
        filters?:{

            status?:Product['status'];

            type?:Product['type'];

            search?:string;

        }

    ):Promise<Product[]> {


        return ProductsRepositoryInstance.search(
            filters
        );

    }





    async create(
        data:Partial<Product>
    ):Promise<Product>{


        return ProductsRepositoryInstance.create(
            data
        );

    }





    async update(
        id:string,
        data:Partial<Product>
    ):Promise<Product | null>{


        return ProductsRepositoryInstance.update(
            id,
            data
        );

    }





    async delete(
        id:string
    ):Promise<boolean>{


        return ProductsRepositoryInstance.delete(
            id
        );

    }





    async restore(
        id:string
    ):Promise<boolean>{


        return ProductsRepositoryInstance.restore(
            id
        );

    }





    async summary():Promise<ProductSummary>{


        return ProductsRepositoryInstance.summary();

    }



}





export const ProductsServiceInstance =
    new ProductsService();
