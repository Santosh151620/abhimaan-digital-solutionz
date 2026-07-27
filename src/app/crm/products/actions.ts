'use server';


import {
    revalidatePath,
} from 'next/cache';


import {
    ProductsServiceInstance,
} from '@/services/crm/ProductsService';



const PRODUCTS_PATH =
    '/crm/products';





export async function createProduct(
    data:Record<string, unknown>,
) {

    try {


        const product =
            await ProductsServiceInstance.create(
                data,
            );



        revalidatePath(
            PRODUCTS_PATH,
        );



        return {
            success:true,
            data:product,
        };


    } catch(error) {


        console.error(
            'CREATE_PRODUCT_ACTION_ERROR',
            error,
        );


        return {
            success:false,
            message:
                'Unable to create product',
        };

    }

}





export async function updateProduct(
    id:string,
    data:Record<string, unknown>,
) {

    try {


        const product =
            await ProductsServiceInstance.update(
                id,
                data,
            );



        if (!product) {

            return {
                success:false,
                message:
                    'Product not found',
            };

        }



        revalidatePath(
            PRODUCTS_PATH,
        );



        return {
            success:true,
            data:product,
        };


    } catch(error) {


        console.error(
            'UPDATE_PRODUCT_ACTION_ERROR',
            error,
        );


        return {
            success:false,
            message:
                'Unable to update product',
        };

    }

}





export async function deleteProduct(
    id:string,
) {

    try {


        const deleted =
            await ProductsServiceInstance.delete(
                id,
            );



        if (!deleted) {

            return {
                success:false,
                message:
                    'Unable to delete product',
            };

        }



        revalidatePath(
            PRODUCTS_PATH,
        );



        return {
            success:true,
        };


    } catch(error) {


        console.error(
            'DELETE_PRODUCT_ACTION_ERROR',
            error,
        );


        return {
            success:false,
            message:
                'Unable to delete product',
        };

    }

}





export async function restoreProduct(
    id:string,
) {

    try {


        const restored =
            await ProductsServiceInstance.restore(
                id,
            );



        if (!restored) {

            return {
                success:false,
                message:
                    'Unable to restore product',
            };

        }



        revalidatePath(
            PRODUCTS_PATH,
        );



        return {
            success:true,
        };


    } catch(error) {


        console.error(
            'RESTORE_PRODUCT_ACTION_ERROR',
            error,
        );


        return {
            success:false,
            message:
                'Unable to restore product',
        };

    }

}
