import {
    NextRequest,
    NextResponse,
} from 'next/server';


import {
    ProductsServiceInstance,
} from '@/services/crm/ProductsService';



interface RouteContext {

    params: Promise<{
        id:string;
    }>;

}





export async function GET(
    _request:NextRequest,
    context:RouteContext,
) {

    try {


        const {
            id,
        } =
            await context.params;



        const product =
            await ProductsServiceInstance.findById(
                id,
            );



        if (!product) {

            return NextResponse.json(
                {
                    success:false,
                    message:
                        'Product not found',
                },
                {
                    status:404,
                },
            );

        }



        return NextResponse.json(
            {
                success:true,
                data:product,
            },
            {
                status:200,
            },
        );


    } catch(error) {


        console.error(
            'PRODUCT_GET_ERROR',
            error,
        );


        return NextResponse.json(
            {
                success:false,
                message:
                    'Unable to fetch product',
            },
            {
                status:500,
            },
        );

    }

}







export async function PUT(
    request:NextRequest,
    context:RouteContext,
) {

    try {


        const {
            id,
        } =
            await context.params;



        const body =
            await request.json();



        const product =
            await ProductsServiceInstance.update(
                id,
                body,
            );



        if (!product) {

            return NextResponse.json(
                {
                    success:false,
                    message:
                        'Product not found',
                },
                {
                    status:404,
                },
            );

        }



        return NextResponse.json(
            {
                success:true,
                data:product,
            },
            {
                status:200,
            },
        );


    } catch(error) {


        console.error(
            'PRODUCT_UPDATE_ERROR',
            error,
        );


        return NextResponse.json(
            {
                success:false,
                message:
                    'Unable to update product',
            },
            {
                status:500,
            },
        );

    }

}








export async function DELETE(
    _request:NextRequest,
    context:RouteContext,
) {

    try {


        const {
            id,
        } =
            await context.params;



        const deleted =
            await ProductsServiceInstance.delete(
                id,
            );



        if (!deleted) {

            return NextResponse.json(
                {
                    success:false,
                    message:
                        'Unable to delete product',
                },
                {
                    status:400,
                },
            );

        }



        return NextResponse.json(
            {
                success:true,
                message:
                    'Product deleted successfully',
            },
            {
                status:200,
            },
        );


    } catch(error) {


        console.error(
            'PRODUCT_DELETE_ERROR',
            error,
        );


        return NextResponse.json(
            {
                success:false,
                message:
                    'Unable to delete product',
            },
            {
                status:500,
            },
        );

    }

}