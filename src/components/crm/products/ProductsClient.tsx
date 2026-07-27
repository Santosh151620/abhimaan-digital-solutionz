'use client';


import {
    useState,
} from 'react';


import ProductsTable from './ProductsTable';


import ProductsForm from './ProductsForm';



import type {
    Product,
} from '@/types/crm/Products';





interface ProductsClientProps {

    products:Product[];

}






export default function ProductsClient(
    {
        products,
    }:ProductsClientProps,
) {


    const [
        showForm,
        setShowForm,
    ] =
        useState(false);




    return (

        <section
            className="
                space-y-4
            "
        >


            <div
                className="
                    flex
                    justify-end
                "
            >

                <button
                    type="button"
                    onClick={
                        () =>
                            setShowForm(
                                value =>
                                    !value,
                            )
                    }
                    className="
                        rounded
                        border
                        px-4
                        py-2
                        text-sm
                    "
                >
                    {
                        showForm
                            ? 'Close'
                            : 'Add Product'
                    }
                </button>

            </div>




            {
                showForm &&
                (
                    <ProductsForm />
                )
            }




            <ProductsTable
                products={
                    products
                }
            />


        </section>

    );

}