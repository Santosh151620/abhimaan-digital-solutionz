"use client";


import type {

    AuditLog,

} from "@/types/admin/AuditLog";






interface AuditLogTableProps {


    items: AuditLog[];


}







export default function AuditLogTable({


    items,


}:AuditLogTableProps){






    if(items.length === 0){



        return (



            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">


                No audit logs found.


            </div>



        );


    }








    return (



        <div className="overflow-x-auto rounded-lg border bg-white">







            <table className="min-w-full">








                <thead className="bg-gray-50">





                    <tr>





                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Action


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Entity


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Description


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            User


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Date


                        </th>





                    </tr>





                </thead>









                <tbody>







                    {items.map(







                        log => (







                            <tr



                                key={log.id}



                                className="border-t"



                            >







                                <td className="px-4 py-3">



                                    <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">



                                        {log.action}



                                    </span>



                                </td>







                                <td className="px-4 py-3">



                                    <div className="font-medium">



                                        {log.entityType}



                                    </div>







                                    {



                                        log.entityId && (



                                            <div className="text-xs text-gray-500">



                                                {log.entityId}



                                            </div>



                                        )



                                    }



                                </td>







                                <td className="px-4 py-3">



                                    {log.description ?? "-"}



                                </td>







                                <td className="px-4 py-3">



                                    {log.userName ?? log.userId ?? "-"}



                                </td>







                                <td className="px-4 py-3 text-sm text-gray-500">



                                    {log.createdAt ?? "-"}



                                </td>







                            </tr>







                        ),






                    )}







                </tbody>







            </table>







        </div>





    );


}