'use client';


import {
    useState,
} from 'react';


import {
    createProduct,
} from '@/app/crm/products/actions';





interface FormState {

    name:string;

    type:string;

    price:string;

    description:string;

}






const initialState:FormState = {

    name:'',

    type:'',

    price:'',

    description:'',

};







export default function ProductsForm() {


    const [
        form,
        setForm,
    ] =
        useState<FormState>(
            initialState,
        );



    const [
        loading,
        setLoading,
    ] =
        useState(false);



    const [
        message,
        setMessage,
    ] =
        useState<string | null>(
            null,
        );






    function updateField(
        field:keyof FormState,
        value:string,
    ) {

        setForm(
            current => (
                {
                    ...current,
                    [field]:value,
                }
            ),
        );

    }







    async function handleSubmit(
        event:React.FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault();


        setLoading(true);

        setMessage(null);



        try {


            const result =
                await createProduct(
                    {
                        name:
                            form.name,

                        type:
                            form.type,

                        price:
                            Number(
                                form.price,
                            ),

                        description:
                            form.description,
                    },
                );



            if (!result.success) {


                setMessage(
                    result.message ??
                    'Unable to create product',
                );


                return;

            }



            setForm(
                initialState,
            );


            setMessage(
                'Product created successfully',
            );



        } catch(error) {


            console.error(
                'PRODUCT_FORM_ERROR',
                error,
            );


            setMessage(
                'Something went wrong',
            );


        } finally {


            setLoading(false);

        }

    }







    return (

        <form
            onSubmit={
                handleSubmit
            }
            className="
                space-y-4
                rounded
                border
                p-5
            "
        >


            <div>

                <label
                    className="
                        mb-1
                        block
                        text-sm
                        font-medium
                    "
                >
                    Product Name
                </label>


                <input
                    required
                    value={
                        form.name
                    }
                    onChange={
                        event =>
                            updateField(
                                'name',
                                event.target.value,
                            )
                    }
                    className="
                        w-full
                        rounded
                        border
                        px-3
                        py-2
                    "
                    placeholder="Enter product name"
                />

            </div>





            <div>

                <label
                    className="
                        mb-1
                        block
                        text-sm
                        font-medium
                    "
                >
                    Product Type
                </label>


                <input
                    value={
                        form.type
                    }
                    onChange={
                        event =>
                            updateField(
                                'type',
                                event.target.value,
                            )
                    }
                    className="
                        w-full
                        rounded
                        border
                        px-3
                        py-2
                    "
                    placeholder="Service / Product"
                />

            </div>





            <div>

                <label
                    className="
                        mb-1
                        block
                        text-sm
                        font-medium
                    "
                >
                    Price
                </label>


                <input
                    type="number"
                    min="0"
                    value={
                        form.price
                    }
                    onChange={
                        event =>
                            updateField(
                                'price',
                                event.target.value,
                            )
                    }
                    className="
                        w-full
                        rounded
                        border
                        px-3
                        py-2
                    "
                    placeholder="0"
                />

            </div>





            <div>

                <label
                    className="
                        mb-1
                        block
                        text-sm
                        font-medium
                    "
                >
                    Description
                </label>


                <textarea
                    value={
                        form.description
                    }
                    onChange={
                        event =>
                            updateField(
                                'description',
                                event.target.value,
                            )
                    }
                    className="
                        w-full
                        rounded
                        border
                        px-3
                        py-2
                    "
                    rows={4}
                    placeholder="Optional description"
                />

            </div>





            {
                message &&
                (
                    <p
                        className="
                            text-sm
                        "
                    >
                        {
                            message
                        }
                    </p>
                )
            }






            <button
                disabled={
                    loading
                }
                type="submit"
                className="
                    rounded
                    border
                    px-5
                    py-2
                    disabled:opacity-50
                "
            >

                {
                    loading
                        ? 'Saving...'
                        : 'Save Product'
                }

            </button>


        </form>

    );

}