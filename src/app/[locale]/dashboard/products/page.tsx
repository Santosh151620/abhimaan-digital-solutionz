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
