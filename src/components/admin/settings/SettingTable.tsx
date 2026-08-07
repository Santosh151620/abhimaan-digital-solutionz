"use client";


import type {

    PlatformSetting,

} from "@/types/admin/Settings";







interface SettingTableProps {


    items: PlatformSetting[];



}







export default function SettingTable({


    items,


}:SettingTableProps){






    if(items.length === 0){



        return (



            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">


                No settings found.


            </div>



        );


    }








    return (



        <div className="overflow-x-auto rounded-lg border bg-white">







            <table className="min-w-full">








                <thead className="bg-gray-50">





                    <tr>





                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Name


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Key


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Category


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Scope


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Type


                        </th>







                        <th className="px-4 py-3 text-left text-sm font-semibold">


                            Status


                        </th>





                    </tr>





                </thead>









                <tbody>







                    {items.map(







                        setting => (







                            <tr



                                key={setting.id}



                                className="border-t"



                            >







                                <td className="px-4 py-3">



                                    <div className="font-medium">



                                        {setting.name}



                                    </div>







                                    <div className="text-sm text-gray-500">



                                        {setting.description ?? "-"}



                                    </div>



                                </td>







                                <td className="px-4 py-3 font-mono text-sm">



                                    {setting.key}



                                </td>







                                <td className="px-4 py-3">



                                    {setting.category}



                                </td>







                                <td className="px-4 py-3">



                                    {setting.scope}



                                </td>







                                <td className="px-4 py-3">



                                    {setting.valueType}



                                </td>







                                <td className="px-4 py-3">







                                    <span



                                        className={



                                            setting.isActive



                                                ? "rounded bg-green-100 px-2 py-1 text-xs text-green-700"



                                                : "rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"



                                        }



                                    >



                                        {setting.isActive ? "Active" : "Inactive"}



                                    </span>







                                </td>







                            </tr>







                        ),






                    )}







                </tbody>







            </table>







        </div>





    );


}