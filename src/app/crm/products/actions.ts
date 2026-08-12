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
    data: Record<string, unknown>,
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







async function updateProduct(
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









async function deleteProduct(
    id:string,
) {

    try {


        await ProductsServiceInstance.delete(
            id,
        );



        revalidatePath(
            PRODUCTS_PATH,
        );



        return {

            success:true,

            message:
                'Product deleted successfully',

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









async function restoreProduct(
    id:string,
) {

    try {


        await ProductsServiceInstance.restore(
            id,
        );



        revalidatePath(
            PRODUCTS_PATH,
        );



        return {

            success:true,

            message:
                'Product restored successfully',

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