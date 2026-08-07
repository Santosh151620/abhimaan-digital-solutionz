"use client";


import {

    useState,

} from "react";



import type {

    Announcement,

} from "@/types/admin/Announcement";





interface AnnouncementDialogProps {


    initialData?: Announcement;



}







export default function AnnouncementDialog({


    initialData,


}:AnnouncementDialogProps){





    const [



        open,



        setOpen,



    ] = useState(false);







    const [



        form,



        setForm,



    ] = useState<Partial<Announcement>>(



        initialData ?? {



            title:"",



            content:"",



            status:"DRAFT",



            priority:"NORMAL",



        },



    );









    function update<K extends keyof Announcement>(



        key:K,



        value:Announcement[K],



    ){





        setForm(previous => ({



            ...previous,



            [key]:value,



        }));



    }









    async function submit(){



        setOpen(false);



    }









    if(!open){



        return (



            <button



                className="rounded bg-blue-600 px-4 py-2 text-white"



                onClick={() => setOpen(true)}



            >



                New Announcement



            </button>



        );



    }









    return (



        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">





            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">





                <h2 className="mb-6 text-xl font-semibold">



                    {initialData ? "Edit Announcement" : "New Announcement"}



                </h2>









                <div className="space-y-4">







                    <input



                        className="w-full rounded border p-2"



                        placeholder="Title"



                        value={form.title ?? ""}



                        onChange={event =>



                            update(



                                "title",



                                event.target.value,



                            )



                        }



                    />









                    <textarea



                        className="w-full rounded border p-2"



                        rows={5}



                        placeholder="Content"



                        value={form.content ?? ""}



                        onChange={event =>



                            update(



                                "content",



                                event.target.value,



                            )



                        }



                    />









                    <select



                        className="w-full rounded border p-2"



                        value={form.priority ?? "NORMAL"}



                        onChange={event =>



                            update(



                                "priority",



                                event.target.value as Announcement["priority"],



                            )



                        }



                    >



                        <option value="LOW">Low</option>



                        <option value="NORMAL">Normal</option>



                        <option value="HIGH">High</option>



                        <option value="URGENT">Urgent</option>



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



                        className="rounded bg-blue-600 px-4 py-2 text-white"



                        onClick={submit}



                    >



                        Save



                    </button>







                </div>







            </div>







        </div>



    );



}