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
