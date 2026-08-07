"use client";


import type {

    Policy,

} from "@/types/admin/Policy";






interface PolicyTableProps {


    items: Policy[];



    onEdit?(

        policy: Policy,

    ):void;




    onDelete?(

        policy: Policy,

    ):void;


}







export default function PolicyTable({


    items,


    onEdit,


    onDelete,


}:PolicyTableProps){






    if(items.length === 0){



        return (



            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">


                No policies found.


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


                            Policy


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Type


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Mandatory


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







                        policy => (







                            <tr



                                key={policy.id}



                                className="border-t"



                            >







                                <td className="px-4 py-3">



                                    {policy.policyCode}



                                </td>







                                <td className="px-4 py-3">





                                    <div className="font-medium">



                                        {policy.policyName}



                                    </div>







                                    {



                                        policy.description && (



                                            <div className="text-sm text-gray-500">



                                                {policy.description}



                                            </div>



                                        )



                                    }





                                </td>









                                <td className="px-4 py-3">



                                    {policy.type}



                                </td>









                                <td className="px-4 py-3">



                                    {policy.isMandatory ? "Yes" : "No"}



                                </td>









                                <td className="px-4 py-3">





                                    <span



                                        className={



                                            policy.status === "Active"



                                                ? "rounded bg-green-100 px-2 py-1 text-xs text-green-700"



                                                : "rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"



                                        }



                                    >



                                        {policy.status}



                                    </span>





                                </td>









                                <td className="px-4 py-3">





                                    <div className="flex justify-end gap-2">







                                        <button



                                            className="rounded border px-3 py-1 text-sm"



                                            onClick={() =>



                                                onEdit?.(



                                                    policy,



                                                )



                                            }



                                        >



                                            Edit



                                        </button>









                                        <button



                                            className="rounded border border-red-300 px-3 py-1 text-sm text-red-600"



                                            onClick={() =>



                                                onDelete?.(



                                                    policy,



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