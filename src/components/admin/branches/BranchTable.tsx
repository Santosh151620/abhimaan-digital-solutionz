"use client";


import type {

    Branch,

} from "@/types/admin/Branch";






interface BranchTableProps {


    items: Branch[];



    onEdit?(

        branch: Branch,

    ):void;




    onDelete?(

        branch: Branch,

    ):void;


}







export default function BranchTable({


    items,


    onEdit,


    onDelete,


}:BranchTableProps){






    if(items.length === 0){



        return (



            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">


                No branches found.


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


                            Branch


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







                        branch => (







                            <tr



                                key={branch.id}



                                className="border-t"



                            >







                                <td className="px-4 py-3">



                                    {branch.branchCode}



                                </td>







                                <td className="px-4 py-3">





                                    <div className="font-medium">



                                        {branch.branchName}



                                    </div>







                                    {



                                        branch.description && (



                                            <div className="text-sm text-gray-500">



                                                {branch.description}



                                            </div>



                                        )



                                    }





                                </td>









                                <td className="px-4 py-3">



                                    {branch.city ?? "-"}



                                </td>









                                <td className="px-4 py-3">



                                    {branch.country ?? "-"}



                                </td>









                                <td className="px-4 py-3">





                                    <span



                                        className={



                                            branch.status === "Active"



                                                ? "rounded bg-green-100 px-2 py-1 text-xs text-green-700"



                                                : "rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"



                                        }



                                    >



                                        {branch.status}



                                    </span>





                                </td>









                                <td className="px-4 py-3">





                                    <div className="flex justify-end gap-2">







                                        <button



                                            className="rounded border px-3 py-1 text-sm"



                                            onClick={() =>



                                                onEdit?.(



                                                    branch,



                                                )



                                            }



                                        >



                                            Edit



                                        </button>









                                        <button



                                            className="rounded border border-red-300 px-3 py-1 text-sm text-red-600"



                                            onClick={() =>



                                                onDelete?.(



                                                    branch,



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