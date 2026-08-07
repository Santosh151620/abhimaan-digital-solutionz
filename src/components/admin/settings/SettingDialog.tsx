"use client";


import {

    useState,

} from "react";



import type {

    PlatformSetting,

} from "@/types/admin/Settings";







interface SettingDialogProps {


    initialData?: PlatformSetting;



}







export default function SettingDialog({


    initialData,


}:SettingDialogProps){





    const [



        open,



        setOpen,



    ] = useState(false);









    const [



        form,



        setForm,



    ] = useState<Partial<PlatformSetting>>(



        initialData ?? {



            scope:"Organization",



            category:"General",



            key:"",



            name:"",



            value:"",



            valueType:"String",



            isSystem:false,



            isReadonly:false,



            isEncrypted:false,



            isVisible:true,



            isActive:true,



        },



    );









    function update<K extends keyof PlatformSetting>(



        key:K,



        value:PlatformSetting[K],



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



                New Setting



            </button>



        );



    }









    return (



        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">





            <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">





                <h2 className="mb-6 text-xl font-semibold">



                    {initialData ? "Edit Setting" : "New Setting"}



                </h2>









                <div className="space-y-4">







                    <input



                        className="w-full rounded border p-2"



                        placeholder="Setting Key"



                        value={form.key ?? ""}



                        onChange={event =>



                            update(



                                "key",



                                event.target.value,



                            )



                        }



                    />









                    <input



                        className="w-full rounded border p-2"



                        placeholder="Display Name"



                        value={form.name ?? ""}



                        onChange={event =>



                            update(



                                "name",



                                event.target.value,



                            )



                        }



                    />









                    <textarea



                        className="w-full rounded border p-2"



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



                        placeholder="Value"



                        value={String(form.value ?? "")}



                        onChange={event =>



                            update(



                                "value",



                                event.target.value,



                            )



                        }



                    />









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