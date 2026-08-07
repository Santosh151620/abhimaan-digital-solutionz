"use client";


import {

    useState,

} from "react";



import type {

    Team,

} from "@/types/admin/Team";



import {

    saveTeam,

} from "@/app/admin/(protected)/teams/page-actions";




interface TeamDialogProps {

    initialData?: Team;

}



const defaultTeam:Partial<Team> = {

    teamCode:"",

    teamName:"",

    description:"",

    status:"Active",

    metadata:{},

};




export default function TeamDialog({

    initialData,

}:TeamDialogProps){



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

    ] = useState<Partial<Team>>(

        initialData ?? defaultTeam,

    );





    function update<K extends keyof Team>(

        key:K,

        value:Team[K],

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


            await saveTeam(

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

                New Team

            </button>

        );

    }





    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">


            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">



                <h2 className="mb-6 text-xl font-semibold">

                    {

                        initialData

                            ? "Edit Team"

                            : "New Team"

                    }

                </h2>




                <div className="space-y-4">



                    <input

                        className="w-full rounded border p-2"

                        placeholder="Team Code"

                        value={form.teamCode ?? ""}

                        onChange={event =>

                            update(

                                "teamCode",

                                event.target.value,

                            )

                        }

                    />




                    <input

                        className="w-full rounded border p-2"

                        placeholder="Team Name"

                        value={form.teamName ?? ""}

                        onChange={event =>

                            update(

                                "teamName",

                                event.target.value,

                            )

                        }

                    />





                    <textarea

                        className="w-full rounded border p-2"

                        rows={4}

                        placeholder="Description"

                        value={form.description ?? ""}

                        onChange={event =>

                            update(

                                "description",

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

                                event.target.value as Team["status"],

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