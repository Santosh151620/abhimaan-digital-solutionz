import type {
    Product,
    ProductSummary,
} from '@/types/crm/Products';


class ProductsRepository {


    private products =
        new Map<string, Product>();


    async list(): Promise<Product[]> {

        return Array.from(
            this.products.values()
        )
        .filter(
            product =>
                !product.isDeleted
        );

    }



    async listArchived(): Promise<Product[]> {

        return Array.from(
            this.products.values()
        )
        .filter(
            product =>
                product.isDeleted
        );

    }



    async findById(
        id:string
    ):Promise<Product | null>{

        return (
            this.products.get(id)
            ??
            null
        );

    }



    async create(
        data:Partial<Product>
    ):Promise<Product>{

        const now =
            new Date()
            .toISOString();


        const product:Product = {

            id:
                crypto.randomUUID(),

            organizationId:
                data.organizationId,

            productNumber:
                data.productNumber
                ??
                `PRD-${Date.now()}`,

            sku:
                data.sku,

            name:
                data.name
                ??
                '',

            description:
                data.description,

            type:
                data.type
                ??
                'Product',

            status:
                data.status
                ??
                'Draft',

            unit:
                data.unit,

            price:
                data.price
                ??
                0,

            cost:
                data.cost,

            taxRate:
                data.taxRate,

            category:
                data.category,

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


        this.products.set(
            product.id,
            product
        );


        return product;

    }



    async update(
        id:string,
        data:Partial<Product>
    ):Promise<Product | null>{


        const existing =
            this.products.get(id);


        if(!existing){

            return null;

        }


        const updated:Product = {

            ...existing,

            ...data,

            updatedAt:
                new Date()
                .toISOString(),

        };


        this.products.set(
            id,
            updated
        );


        return updated;

    }



    async delete(
        id:string
    ):Promise<boolean>{


        const product =
            this.products.get(id);


        if(!product){

            return false;

        }


        product.isDeleted = true;

        product.status =
            'Archived';

        product.deletedAt =
            new Date()
            .toISOString();


        product.updatedAt =
            new Date()
            .toISOString();


        this.products.set(
            id,
            product
        );


        return true;

    }



    async restore(
        id:string
    ):Promise<boolean>{


        const product =
            this.products.get(id);


        if(!product){

            return false;

        }


        product.isDeleted = false;

        product.deletedAt = null;

        product.deletedBy = null;


        if(
            product.status === 'Archived'
        ){

            product.status =
                'Active';

        }


        product.updatedAt =
            new Date()
            .toISOString();


        this.products.set(
            id,
            product
        );


        return true;

    }



    async search(
        filters?: {

            status?: Product['status'];

            type?: Product['type'];

            search?: string;

        }

    ):Promise<Product[]>{


        let products =
            await this.list();


        if(filters?.status){

            products =
                products.filter(
                    product =>
                        product.status === filters.status
                );

        }


        if(filters?.type){

            products =
                products.filter(
                    product =>
                        product.type === filters.type
                );

        }


        if(filters?.search){

            const keyword =
                filters.search.toLowerCase();


            products =
                products.filter(
                    product =>

                        product.name
                        .toLowerCase()
                        .includes(keyword)

                        ||

                        product.sku
                        ?.toLowerCase()
                        .includes(keyword)

                );

        }


        return products;

    }



    async summary():Promise<ProductSummary>{


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



export const ProductsRepositoryInstance =
    new ProductsRepository();