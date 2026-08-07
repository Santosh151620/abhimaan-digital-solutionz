"use client";


import type {

    Announcement,

} from "@/types/admin/Announcement";






interface AnnouncementTableProps {


    items: Announcement[];



}







export default function AnnouncementTable({


    items,


}:AnnouncementTableProps){






    if(items.length === 0){



        return (



            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">


                No announcements found.


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


                            Priority


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Status


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Published


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Created


                        </th>





                    </tr>





                </thead>









                <tbody>







                    {items.map(

                        announcement => (

                            <tr
                                key={announcement.id}
                                className="border-t"
                            >
                                <td className="px-4 py-3">
                                    <div className="font-medium">
                                        {announcement.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {announcement.content.slice(0,80)}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                        {announcement.priority}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {announcement.status}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    {announcement.publishDate ?? "-"}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                    {announcement.createdAt ?? "-"}
                                </td>
                            </tr>
                        ),
                    )}
                </tbody>
            </table>
        </div>
    );
}