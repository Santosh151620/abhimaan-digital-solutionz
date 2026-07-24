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
