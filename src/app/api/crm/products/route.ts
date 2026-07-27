import {
    NextRequest,
    NextResponse,
} from 'next/server';


import {
    ProductsServiceInstance,
} from '@/services/crm/ProductsService';


import type {
    ProductStatus,
    ProductType,
} from '@/types/crm/Products';





function isProductStatus(
    value: string | null,
): value is ProductStatus {

    return (
        value === 'Active' ||
        value === 'Inactive' ||
        value === 'Archived'
    );

}





function isProductType(
    value: string | null,
): value is ProductType {

    return (
        value !== null
    );

}







export async function GET(
    request: NextRequest,
) {

    try {


        const searchParams =
            request.nextUrl.searchParams;



        const search =
            searchParams.get(
                'search',
            )
            ?? undefined;



        const statusParam =
            searchParams.get(
                'status',
            );



        const typeParam =
            searchParams.get(
                'type',
            );



        const status =
            isProductStatus(
                statusParam,
            )
                ? statusParam
                : undefined;



        const type =
            isProductType(
                typeParam,
            )
                ? typeParam
                : undefined;




        const products =
            search || status || type

                ? await ProductsServiceInstance.search(
                    {
                        search,
                        status,
                        type,
                    },
                )

                : await ProductsServiceInstance.list();





        return NextResponse.json(
            {
                success: true,
                data: products,
            },
            {
                status: 200,
            },
        );



    } catch (error) {


        console.error(
            'PRODUCTS_LIST_API_ERROR',
            error,
        );



        return NextResponse.json(
            {
                success: false,
                message:
                    'Unable to load products',
            },
            {
                status: 500,
            },
        );

    }

}









export async function POST(
    request: NextRequest,
) {

    try {


        const body =
            await request.json();



        if (
            !body.name ||
            typeof body.name !== 'string'
        ) {


            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Product name is required',
                },
                {
                    status: 400,
                },
            );

        }



        const product =
            await ProductsServiceInstance.create(
                body,
            );



        return NextResponse.json(
            {
                success: true,
                data: product,
            },
            {
                status: 201,
            },
        );



    } catch (error) {


        console.error(
            'PRODUCT_CREATE_API_ERROR',
            error,
        );



        return NextResponse.json(
            {
                success: false,
                message:
                    'Unable to create product',
            },
            {
                status: 500,
            },
        );

    }

}