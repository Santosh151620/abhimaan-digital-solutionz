import {
    ProductsServiceInstance,
} from '@/services/crm/ProductsService';


import ProductsClient from '@/components/crm/products/ProductsClient';


import ProductsSummary from '@/components/crm/products/ProductsSummary';





export const dynamic =
    'force-dynamic';





export default async function ProductsPage() {


    const [
        products,
        summary,
    ] =
        await Promise.all(
            [
                ProductsServiceInstance.list(),
                ProductsServiceInstance.summary(),
            ],
        );



    return (

        <main
            className="
                space-y-6
                p-6
            "
        >

            <section
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <div>

                    <h1
                        className="
                            text-2xl
                            font-semibold
                        "
                    >
                        Products
                    </h1>


                    <p
                        className="
                            text-sm
                            text-gray-500
                        "
                    >
                        Manage CRM products,
                        services and catalog items.
                    </p>

                </div>


            </section>



            <ProductsSummary
                summary={
                    summary
                }
            />



            <ProductsClient
                products={
                    products
                }
            />


        </main>

    );

}
