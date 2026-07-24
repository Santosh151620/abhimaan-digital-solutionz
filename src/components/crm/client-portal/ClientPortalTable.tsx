import type {
    ClientPortal,
} from '@/types/crm/ClientPortal';



export default function ClientPortalTable({
    portals,
}:{
    portals:ClientPortal[];
}){


    return (

        <table className="w-full border">


            <thead>

                <tr>

                    <th className="border p-2">
                        Name
                    </th>


                    <th className="border p-2">
                        Email
                    </th>


                    <th className="border p-2">
                        Status
                    </th>


                </tr>

            </thead>


            <tbody>


            {
                portals.map(
                    portal => (

                        <tr key={portal.id}>

                            <td className="border p-2">
                                {portal.name}
                            </td>


                            <td className="border p-2">
                                {portal.email}
                            </td>


                            <td className="border p-2">
                                {portal.status}
                            </td>

                        </tr>

                    )
                )
            }


            </tbody>


        </table>

    );

}
