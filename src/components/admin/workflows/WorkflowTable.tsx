"use client";


import type {

    Workflow,

} from "@/types/admin/Workflow";





interface WorkflowTableProps {


    items: Workflow[];



    onEdit?(

        workflow: Workflow,

    ):void;




    onDelete?(

        workflow: Workflow,

    ):void;


}







export default function WorkflowTable({


    items,


    onEdit,


    onDelete,


}:WorkflowTableProps){






    if(items.length === 0){



        return (



            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">


                No workflows found.


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

                            Workflow

                        </th>





                        <th className="px-4 py-3 text-left text-sm font-semibold">

                            Trigger

                        </th>





                        <th className="px-4 py-3 text-left text-sm font-semibold">

                            Entity

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







                        workflow => (







                            <tr



                                key={workflow.id}



                                className="border-t"



                            >







                                <td className="px-4 py-3">



                                    {workflow.workflowCode}



                                </td>







                                <td className="px-4 py-3">





                                    <div className="font-medium">



                                        {workflow.workflowName}



                                    </div>







                                    {



                                        workflow.description && (



                                            <div className="text-sm text-gray-500">



                                                {workflow.description}



                                            </div>



                                        )



                                    }





                                </td>









                                <td className="px-4 py-3">



                                    {workflow.triggerType}



                                </td>









                                <td className="px-4 py-3">



                                    {workflow.entityType ?? "-"}



                                </td>









                                <td className="px-4 py-3">





                                    <span



                                        className={



                                            workflow.status === "Active"



                                                ? "rounded bg-green-100 px-2 py-1 text-xs text-green-700"



                                                : "rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"



                                        }



                                    >



                                        {workflow.status}



                                    </span>





                                </td>









                                <td className="px-4 py-3">





                                    <div className="flex justify-end gap-2">







                                        <button



                                            className="rounded border px-3 py-1 text-sm"



                                            onClick={() =>



                                                onEdit?.(



                                                    workflow,



                                                )



                                            }



                                        >



                                            Edit



                                        </button>









                                        <button



                                            className="rounded border border-red-300 px-3 py-1 text-sm text-red-600"



                                            onClick={() =>



                                                onDelete?.(



                                                    workflow,



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