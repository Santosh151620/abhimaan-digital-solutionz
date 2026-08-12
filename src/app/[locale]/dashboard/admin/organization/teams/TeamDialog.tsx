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

    initialData?:Team;

    onSaved?:()=>Promise<void>|void;

}




const EMPTY_TEAM:Partial<Team> = {

    teamCode:"",

    teamName:"",

    description:"",

    status:"Active",

    metadata:{},

};




export default function TeamDialog({

    initialData,

    onSaved,

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

        initialData ?? EMPTY_TEAM,

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


        if(!form.teamCode?.trim()){

            alert(
                "Team code is required.",
            );

            return;

        }


        if(!form.teamName?.trim()){

            alert(
                "Team name is required.",
            );

            return;

        }



        setLoading(true);



        try {


            await saveTeam(

                form,

            );



            if(onSaved){

                await onSaved();

            }



            setOpen(false);



        }
        catch(error){

            console.error(error);

            alert(
                "Unable to save team.",
            );

        }
        finally{


            setLoading(false);

        }


    }




    return (

        <>


            <button

                className="
                    rounded-md
                    bg-primary
                    px-4
                    py-2
                    text-primary-foreground
                "

                onClick={()=>setOpen(true)}

            >

                New Team

            </button>




            {

                open && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            bg-black/40
                        "
                    >


                        <div
                            className="
                                w-full
                                max-w-lg
                                rounded-xl
                                bg-background
                                p-6
                                shadow-xl
                            "
                        >


                            <h2
                                className="
                                    mb-6
                                    text-xl
                                    font-semibold
                                "
                            >

                                {
                                    initialData
                                    ? "Edit Team"
                                    : "Create Team"
                                }

                            </h2>



                            <div className="space-y-4">


                                <input

                                    className="
                                        w-full
                                        rounded
                                        border
                                        p-2
                                    "

                                    placeholder="Team Code"

                                    value={
                                        form.teamCode ?? ""
                                    }

                                    onChange={
                                        e =>
                                        update(
                                            "teamCode",
                                            e.target.value,
                                        )
                                    }

                                />



                                <input

                                    className="
                                        w-full
                                        rounded
                                        border
                                        p-2
                                    "

                                    placeholder="Team Name"

                                    value={
                                        form.teamName ?? ""
                                    }

                                    onChange={
                                        e =>
                                        update(
                                            "teamName",
                                            e.target.value,
                                        )
                                    }

                                />



                                <textarea

                                    className="
                                        w-full
                                        rounded
                                        border
                                        p-2
                                    "

                                    rows={4}

                                    placeholder="Description"

                                    value={
                                        form.description ?? ""
                                    }

                                    onChange={
                                        e =>
                                        update(
                                            "description",
                                            e.target.value,
                                        )
                                    }

                                />


                            </div>




                            <div
                                className="
                                    mt-6
                                    flex
                                    justify-end
                                    gap-3
                                "
                            >

                                <button

                                    className="
                                        rounded
                                        border
                                        px-4
                                        py-2
                                    "

                                    onClick={
                                        ()=>setOpen(false)
                                    }

                                >

                                    Cancel

                                </button>



                                <button

                                    disabled={loading}

                                    className="
                                        rounded
                                        bg-primary
                                        px-5
                                        py-2
                                        text-primary-foreground
                                    "

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

                )

            }


        </>

    );

}