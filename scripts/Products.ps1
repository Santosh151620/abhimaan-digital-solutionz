$ErrorActionPreference = "Stop"

Write-Host "Generating CRM Products Module..." -ForegroundColor Green

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
"src/types/crm/Products.ts" `
@'
export type ProductType =
    | 'Product'
    | 'Service'
    | 'Subscription'
    | 'Bundle'
    | 'Other';



export type ProductStatus =
    | 'Draft'
    | 'Active'
    | 'Inactive'
    | 'Archived';



export interface Product {


    id:string;


    organizationId?:string;


    productNumber:string;


    sku?:string;


    name:string;


    description?:string;


    type:ProductType;


    status:ProductStatus;


    unit?:string;


    price:number;


    cost?:number;


    taxRate?:number;


    category?:string;


    entityType?:string;


    entityId?:string;


    isDeleted:boolean;


    deletedAt:string | null;


    deletedBy:string | null;


    createdAt:string;


    updatedAt:string;


}



export interface ProductSummary {


    total:number;


    active:number;


    inactive:number;


    archived:number;


}
'@



Write-ProjectFile `
"src/repositories/crm/ProductsRepository.ts" `
@'
import type {
    Product,
    ProductSummary,
} from '@/types/crm/Products';



class ProductsRepository {



    private products =
        new Map<string, Product>();



    async list():Promise<Product[]> {


        return Array.from(
            this.products.values()
        )
        .filter(
            product =>
                !product.isDeleted
        );

    }




    async listArchived():Promise<Product[]> {


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



        product.isDeleted=true;


        product.status='Archived';


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
'@
Write-ProjectFile `
"src/repositories/crm/ProductsRepository.ts" `
@'
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

            status?: ProductStatus;

            type?: ProductType;

            search?: string;

        }

    ):Promise<Product[]> {


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
                filters.search
                .toLowerCase();



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


                        ||


                        product.productNumber
                        .toLowerCase()
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
'@







Write-ProjectFile `
"src/services/crm/ProductsService.ts" `
@'
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
'@
Write-ProjectFile `
"src/components/crm/products/ProductsSummary.tsx" `
@'
import type {
    ProductSummary,
} from '@/types/crm/Products';



export default function ProductsSummary({
    summary,
}:{
    summary:ProductSummary;
}){


    return (

        <div className="grid grid-cols-4 gap-4">


            <div className="rounded border p-4">
                <p>Total</p>
                <strong>{summary.total}</strong>
            </div>


            <div className="rounded border p-4">
                <p>Active</p>
                <strong>{summary.active}</strong>
            </div>


            <div className="rounded border p-4">
                <p>Inactive</p>
                <strong>{summary.inactive}</strong>
            </div>


            <div className="rounded border p-4">
                <p>Archived</p>
                <strong>{summary.archived}</strong>
            </div>


        </div>

    );

}
'@





Write-ProjectFile `
"src/components/crm/products/ProductsTable.tsx" `
@'
import type {
    Product,
} from '@/types/crm/Products';



export default function ProductsTable({
    products,
}:{
    products:Product[];
}){


    return (

        <table className="w-full border">


            <thead>

                <tr>

                    <th className="border p-2">
                        Product
                    </th>

                    <th className="border p-2">
                        Type
                    </th>

                    <th className="border p-2">
                        Status
                    </th>

                    <th className="border p-2">
                        Price
                    </th>

                </tr>

            </thead>


            <tbody>


            {
                products.map(product => (

                    <tr key={product.id}>


                        <td className="border p-2">
                            {product.name}
                        </td>


                        <td className="border p-2">
                            {product.type}
                        </td>


                        <td className="border p-2">
                            {product.status}
                        </td>


                        <td className="border p-2">
                            {product.price}
                        </td>


                    </tr>

                ))
            }


            </tbody>


        </table>

    );

}
'@





Write-ProjectFile `
"src/components/crm/products/ProductsForm.tsx" `
@'
'use client';



import {
    useState,
} from 'react';



export default function ProductsForm(){

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
                    e =>
                    setName(
                        e.target.value
                    )
                }
                placeholder="Product name"
            />


            <button
                className="border px-4 py-2"
                type="submit"
            >
                Save Product
            </button>


        </form>

    );

}
'@





Write-ProjectFile `
"src/components/crm/products/ProductsClient.tsx" `
@'
'use client';



import ProductsTable from './ProductsTable';



import type {
    Product,
} from '@/types/crm/Products';



export default function ProductsClient({
    products,
}:{
    products:Product[];
}){


    return (

        <ProductsTable
            products={products}
        />

    );

}
'@





Write-ProjectFile `
"src/components/crm/products/index.ts" `
@'
export { default as ProductsClient }
from './ProductsClient';


export { default as ProductsForm }
from './ProductsForm';


export { default as ProductsTable }
from './ProductsTable';


export { default as ProductsSummary }
from './ProductsSummary';
'@






Write-ProjectFile `
"src/app/[locale]/dashboard/products/actions.ts" `
@'
'use server';



import {
    ProductsServiceInstance,
} from '@/services/crm/ProductsService';



export async function createProduct(
    data:FormData
){


    return ProductsServiceInstance.create({

        name:
            String(
                data.get('name')
                ?? ''
            ),

    });

}
'@





Write-ProjectFile `
"src/app/[locale]/dashboard/products/page.tsx" `
@'
import {
    ProductsServiceInstance,
} from '@/services/crm/ProductsService';



import {
    ProductsClient,
    ProductsSummary,
} from '@/components/crm/products';



export default async function ProductsPage(){


    const products =
        await ProductsServiceInstance.list();



    const summary =
        await ProductsServiceInstance.summary();



    return (

        <div className="space-y-6">


            <ProductsSummary
                summary={summary}
            />


            <ProductsClient
                products={products}
            />


        </div>

    );

}
'@





Write-ProjectFile `
"src/app/[locale]/dashboard/products/new/page.tsx" `
@'
import {
    ProductsForm,
} from '@/components/crm/products';



export default function NewProductPage(){


    return (

        <ProductsForm />

    );

}
'@





Write-ProjectFile `
"src/app/[locale]/dashboard/products/[id]/page.tsx" `
@'
export default async function ProductDetailsPage({
    params,
}:{
    params:{
        id:string;
    };
}){


    return (

        <div>
            Product {params.id}
        </div>

    );

}
'@





Write-ProjectFile `
"src/app/[locale]/dashboard/products/[id]/edit/page.tsx" `
@'
import {
    ProductsForm,
} from '@/components/crm/products';



export default function EditProductPage(){


    return (

        <ProductsForm />

    );

}
'@



Write-Host ""
Write-Host "CRM Products Module generation completed." -ForegroundColor Green