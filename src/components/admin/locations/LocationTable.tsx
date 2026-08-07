"use client";


import type {

    Location,

} from "@/types/admin/Location";





interface LocationTableProps {


    items: Location[];



    onEdit?(

        location: Location,

    ):void;




    onDelete?(

        location: Location,

    ):void;


}







export default function LocationTable({

    items,

    onEdit,

    onDelete,

}:LocationTableProps){






    if(items.length === 0){



        return (


            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">


                No locations found.


            </div>



        );


    }







    return (



        <div className="overflow-x-auto rounded-lg border bg-white">





            <table className="min-w-full">





                <thead className="bg-gray-50">





                    <tr>



                        <th className="px-4 py-3 text-left text-sm font-semibold">

                            Code

                        </th>





                        <th className="px-4 py-3 text-left text-sm font-semibold">

                            Location

                        </th>





                        <th className="px-4 py-3 text-left text-sm font-semibold">

                            City

                        </th>





                        <th className="px-4 py-3 text-left text-sm font-semibold">

                            Country

                        </th>





                        <th className="px-4 py-3 text-left text-sm font-semibold">

                            Status

                        </th>





                        <th className="px-4 py-3 text-right text-sm font-semibold">

                            Actions

                        </th>





                    </tr>





                </thead>







                <tbody>





                    {items.map(





                        location => (





                            <tr



                                key={location.id}



                                className="border-t"



                            >







                                <td className="px-4 py-3">



                                    {location.locationCode}



                                </td>









                                <td className="px-4 py-3">



                                    <div className="font-medium">



                                        {location.locationName}



                                    </div>





                                    {



                                        location.description && (



                                            <div className="text-sm text-gray-500">



                                                {location.description}



                                            </div>



                                        )



                                    }



                                </td>









                                <td className="px-4 py-3">



                                    {location.city ?? "-"}



                                </td>









                                <td className="px-4 py-3">



                                    {location.country ?? "-"}



                                </td>









                                <td className="px-4 py-3">





                                    <span



                                        className={



                                            location.status === "Active"



                                                ? "rounded bg-green-100 px-2 py-1 text-xs text-green-700"



                                                : "rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"



                                        }



                                    >



                                        {location.status}



                                    </span>





                                </td>









                                <td className="px-4 py-3">





                                    <div className="flex justify-end gap-2">





                                        <button



                                            className="rounded border px-3 py-1 text-sm"



                                            onClick={() =>



                                                onEdit?.(



                                                    location,



                                                )



                                            }



                                        >



                                            Edit



                                        </button>









                                        <button



                                            className="rounded border border-red-300 px-3 py-1 text-sm text-red-600"



                                            onClick={() =>



                                                onDelete?.(



                                                    location,



                                                )



                                            }



                                        >



                                            Delete



                                        </button>





                                    </div>





                                </td>







                            </tr>





                        ),





                    )}







                </tbody>







            </table>







        </div>





    );



}