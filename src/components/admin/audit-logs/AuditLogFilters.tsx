"use client";


import {

    useState,

} from "react";



interface AuditLogFiltersProps {


    onSearch?(

        value:string,

    ):void;



}







export default function AuditLogFilters({


    onSearch,


}:AuditLogFiltersProps){





    const [



        value,



        setValue,



    ] = useState("");









    function change(



        next:string,



    ){







        setValue(next);









        onSearch?.(



            next,



        );







    }









    return (







        <div className="rounded-lg border bg-white p-4">







            <input



                className="w-full rounded border p-2"



                placeholder="Search audit logs..."



                value={value}



                onChange={event =>



                    change(



                        event.target.value,



                    )



                }



            />







        </div>







    );



}