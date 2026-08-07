"use client";


import {

    useState,

} from "react";



interface NotificationFiltersProps {


    onSearch?(

        value:string,

    ):void;



}







export default function NotificationFilters({


    onSearch,


}:NotificationFiltersProps){





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



                placeholder="Search notifications..."



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