import type {
    Product,
} from '@/types/crm/Products';



export default function ProductsTable({
    products,
}:{
    products:Product[];
}){


    return (

        <table className="w-full border">


            <thead>

                <tr>

                    <th className="border p-2">
                        Product
                    </th>

                    <th className="border p-2">
                        Type
                    </th>

                    <th className="border p-2">
                        Status
                    </th>

                    <th className="border p-2">
                        Price
                    </th>

                </tr>

            </thead>


            <tbody>


            {
                products.map(product => (

                    <tr key={product.id}>


                        <td className="border p-2">
                            {product.name}
                        </td>


                        <td className="border p-2">
                            {product.type}
                        </td>


                        <td className="border p-2">
                            {product.status}
                        </td>


                        <td className="border p-2">
                            {product.price}
                        </td>


                    </tr>

                ))
            }


            </tbody>


        </table>

    );

}
