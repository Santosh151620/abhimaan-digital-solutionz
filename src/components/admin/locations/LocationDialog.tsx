"use client";


import {

    useState,

} from "react";



import type {

    Location,

} from "@/types/admin/Location";



import {

    saveLocation,

} from "@/app/admin/(protected)/locations/page-actions";




interface LocationDialogProps {

    initialData?: Location;

}




const defaultLocation:Partial<Location> = {


    locationCode:"",


    locationName:"",


    description:"",


    addressLine1:"",


    addressLine2:"",


    city:"",


    state:"",


    country:"",


    postalCode:"",


    status:"Active",


    metadata:{},


};





export default function LocationDialog({

    initialData,

}:LocationDialogProps){



    const [

        open,

        setOpen,

    ] = useState(false);





    const [

        loading,

        setLoading,

    ] = useState(false);





    const [

        form,

        setForm,

    ] = useState<Partial<Location>>(

        initialData ?? defaultLocation,

    );





    function update<K extends keyof Location>(

        key:K,

        value:Location[K],

    ){


        setForm(

            previous => ({

                ...previous,

                [key]:value,

            }),

        );


    }






    async function submit(){



        setLoading(true);




        try {



            await saveLocation(

                form,

            );



            setOpen(false);



            location.reload();




        }

        finally {



            setLoading(false);


        }


    }






    if(!open){



        return (



            <button

                className="rounded bg-blue-600 px-4 py-2 text-white"

                onClick={() => setOpen(true)}

            >


                New Location


            </button>



        );


    }







    return (



        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">



            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">





                <h2 className="mb-6 text-xl font-semibold">


                    {

                        initialData

                            ? "Edit Location"

                            : "New Location"


                    }


                </h2>







                <div className="space-y-4">





                    <input


                        className="w-full rounded border p-2"


                        placeholder="Location Code"


                        value={form.locationCode ?? ""}


                        onChange={event =>


                            update(


                                "locationCode",


                                event.target.value,


                            )


                        }


                    />






                    <input


                        className="w-full rounded border p-2"


                        placeholder="Location Name"


                        value={form.locationName ?? ""}


                        onChange={event =>


                            update(


                                "locationName",


                                event.target.value,


                            )


                        }


                    />







                    <textarea


                        className="w-full rounded border p-2"


                        rows={3}


                        placeholder="Description"


                        value={form.description ?? ""}


                        onChange={event =>


                            update(


                                "description",


                                event.target.value,


                            )


                        }


                    />







                    <input


                        className="w-full rounded border p-2"


                        placeholder="City"


                        value={form.city ?? ""}


                        onChange={event =>


                            update(


                                "city",


                                event.target.value,


                            )


                        }


                    />







                    <input


                        className="w-full rounded border p-2"


                        placeholder="Country"


                        value={form.country ?? ""}


                        onChange={event =>


                            update(


                                "country",


                                event.target.value,


                            )


                        }


                    />







                    <select


                        className="w-full rounded border p-2"


                        value={form.status ?? "Active"}


                        onChange={event =>


                            update(


                                "status",


                                event.target.value as Location["status"],


                            )


                        }


                    >



                        <option value="Active">

                            Active

                        </option>





                        <option value="Inactive">

                            Inactive

                        </option>





                    </select>





                </div>








                <div className="mt-6 flex justify-end gap-2">





                    <button


                        className="rounded border px-4 py-2"


                        onClick={() => setOpen(false)}


                    >


                        Cancel


                    </button>







                    <button


                        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"


                        disabled={loading}


                        onClick={submit}


                    >



                        {


                            loading


                                ? "Saving..."


                                : "Save"



                        }



                    </button>





                </div>





            </div>



        </div>



    );


}