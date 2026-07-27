import type {
    Product,
} from '@/types/crm/Products';



interface ProductsTableProps {

    products:Product[];

}





function StatusBadge(
    {
        status,
    }:{
        status:Product['status'];
    },
) {


    return (

        <span
            className="
                inline-flex
                rounded-full
                border
                px-2
                py-1
                text-xs
                font-medium
            "
        >
            {status}
        </span>

    );

}





export default function ProductsTable(
    {
        products,
    }:ProductsTableProps,
) {


    if (
        products.length === 0
    ) {

        return (

            <div
                className="
                    rounded
                    border
                    p-8
                    text-center
                "
            >

                <p
                    className="
                        text-sm
                        text-gray-500
                    "
                >
                    No products found.
                </p>

            </div>

        );

    }




    return (

        <div
            className="
                overflow-x-auto
                rounded
                border
            "
        >

            <table
                className="
                    min-w-full
                    text-sm
                "
            >

                <thead>

                    <tr
                        className="
                            border-b
                        "
                    >

                        <th
                            className="
                                px-4
                                py-3
                                text-left
                                font-medium
                            "
                        >
                            Product
                        </th>


                        <th
                            className="
                                px-4
                                py-3
                                text-left
                                font-medium
                            "
                        >
                            Type
                        </th>


                        <th
                            className="
                                px-4
                                py-3
                                text-left
                                font-medium
                            "
                        >
                            Status
                        </th>


                        <th
                            className="
                                px-4
                                py-3
                                text-right
                                font-medium
                            "
                        >
                            Price
                        </th>

                    </tr>

                </thead>



                <tbody>

                    {
                        products.map(
                            product =>
                            (

                                <tr
                                    key={
                                        product.id
                                    }
                                    className="
                                        border-b
                                    "
                                >

                                    <td
                                        className="
                                            px-4
                                            py-3
                                        "
                                    >

                                        <div
                                            className="
                                                font-medium
                                            "
                                        >
                                            {
                                                product.name
                                            }
                                        </div>


                                        {
                                            product.description &&
                                            (
                                                <div
                                                    className="
                                                        text-xs
                                                        text-gray-500
                                                    "
                                                >
                                                    {
                                                        product.description
                                                    }
                                                </div>
                                            )
                                        }

                                    </td>



                                    <td
                                        className="
                                            px-4
                                            py-3
                                        "
                                    >
                                        {
                                            product.type
                                        }
                                    </td>




                                    <td
                                        className="
                                            px-4
                                            py-3
                                        "
                                    >

                                        <StatusBadge
                                            status={
                                                product.status
                                            }
                                        />

                                    </td>




                                    <td
                                        className="
                                            px-4
                                            py-3
                                            text-right
                                        "
                                    >
                                        {
                                            product.price
                                        }
                                    </td>


                                </tr>

                            )
                        )
                    }

                </tbody>

            </table>

        </div>

    );

}