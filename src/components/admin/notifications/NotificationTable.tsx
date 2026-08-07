"use client";


import type {

    Notification,

} from "@/types/admin/Notification";






interface NotificationTableProps {


    items: Notification[];



    onRead?(

        notification:Notification,

    ):void;



}







export default function NotificationTable({


    items,


    onRead,


}:NotificationTableProps){






    if(items.length === 0){



        return (



            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">


                No notifications found.


            </div>



        );


    }








    return (



        <div className="overflow-x-auto rounded-lg border bg-white">







            <table className="min-w-full">








                <thead className="bg-gray-50">





                    <tr>





                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Title


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Message


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Type


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Status


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Date


                        </th>







                        <th className="px-4 py-3 text-right text-sm font-semibold">


                            Actions


                        </th>





                    </tr>





                </thead>









                <tbody>







                    {items.map(







                        notification => (







                            <tr



                                key={notification.id}



                                className="border-t"



                            >







                                <td className="px-4 py-3">



                                    <div className="font-medium">



                                        {notification.title}



                                    </div>



                                </td>







                                <td className="px-4 py-3">



                                    {notification.message}



                                </td>







                                <td className="px-4 py-3">





                                    <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">



                                        {notification.type}



                                    </span>





                                </td>







                                <td className="px-4 py-3">





                                    <span



                                        className={



                                            notification.status === "READ"



                                                ? "rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"



                                                : "rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700"



                                        }



                                    >



                                        {notification.status}



                                    </span>





                                </td>







                                <td className="px-4 py-3 text-sm text-gray-500">



                                    {notification.createdAt ?? "-"}



                                </td>







                                <td className="px-4 py-3 text-right">







                                    {notification.status === "UNREAD" && (







                                        <button



                                            className="rounded border px-3 py-1 text-sm"



                                            onClick={() =>



                                                onRead?.(



                                                    notification,



                                                )



                                            }



                                        >



                                            Mark Read



                                        </button>







                                    )}







                                </td>







                            </tr>







                        ),






                    )}







                </tbody>







            </table>







        </div>





    );


}