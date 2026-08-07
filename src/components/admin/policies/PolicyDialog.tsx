"use client";


import {

    useState,

} from "react";



import type {

    Policy,

} from "@/types/admin/Policy";



import {

    savePolicy,

} from "@/app/admin/(protected)/policies/page-actions";






interface PolicyDialogProps {


    initialData?: Policy;


}







const defaultPolicy:Partial<Policy> = {




    policyCode:"",




    policyName:"",




    description:"",




    type:"Organization",




    value:{},




    isMandatory:false,




    status:"Active",



};









export default function PolicyDialog({



    initialData,



}:PolicyDialogProps){







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



    ] = useState<Partial<Policy>>(



        initialData ?? defaultPolicy,



    );









    function update<K extends keyof Policy>(



        key:K,



        value:Policy[K],



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







            await savePolicy(



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







                New Policy







            </button>







        );







    }













    return (







        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">







            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">







                <h2 className="mb-6 text-xl font-semibold">







                    {



                        initialData



                            ? "Edit Policy"



                            : "New Policy"







                    }







                </h2>









                <div className="space-y-4">







                    <input



                        className="w-full rounded border p-2"



                        placeholder="Policy Code"



                        value={form.policyCode ?? ""}



                        onChange={event =>



                            update(



                                "policyCode",



                                event.target.value,



                            )



                        }



                    />









                    <input



                        className="w-full rounded border p-2"



                        placeholder="Policy Name"



                        value={form.policyName ?? ""}



                        onChange={event =>



                            update(



                                "policyName",



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









                    <select



                        className="w-full rounded border p-2"



                        value={form.type ?? "Organization"}



                        onChange={event =>



                            update(



                                "type",



                                event.target.value as Policy["type"],



                            )



                        }



                    >







                        <option value="System">



                            System



                        </option>









                        <option value="Organization">



                            Organization



                        </option>









                        <option value="Security">



                            Security



                        </option>









                        <option value="Workflow">



                            Workflow



                        </option>







                    </select>









                    <select



                        className="w-full rounded border p-2"



                        value={form.status ?? "Active"}



                        onChange={event =>



                            update(



                                "status",



                                event.target.value as Policy["status"],



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