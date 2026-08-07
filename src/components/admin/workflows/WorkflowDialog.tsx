"use client";


import {

    useState,

} from "react";



import type {

    Workflow,

} from "@/types/admin/Workflow";



import {

    saveWorkflow,

} from "@/app/admin/(protected)/workflows/page-actions";







interface WorkflowDialogProps {


    initialData?: Workflow;


}








const defaultWorkflow:Partial<Workflow> = {




    workflowCode:"",




    workflowName:"",




    description:"",




    triggerType:"Manual",




    entityType:"",




    actionType:"",




    configuration:{},




    status:"Active",




    isSystem:false,



};









export default function WorkflowDialog({



    initialData,



}:WorkflowDialogProps){







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



    ] = useState<Partial<Workflow>>(



        initialData ?? defaultWorkflow,



    );









    function update<K extends keyof Workflow>(



        key:K,



        value:Workflow[K],



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







            await saveWorkflow(



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







                New Workflow







            </button>







        );







    }













    return (







        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">







            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">







                <h2 className="mb-6 text-xl font-semibold">







                    {



                        initialData



                            ? "Edit Workflow"



                            : "New Workflow"







                    }







                </h2>









                <div className="space-y-4">







                    <input



                        className="w-full rounded border p-2"



                        placeholder="Workflow Code"



                        value={form.workflowCode ?? ""}



                        onChange={event =>



                            update(



                                "workflowCode",



                                event.target.value,



                            )



                        }



                    />









                    <input



                        className="w-full rounded border p-2"



                        placeholder="Workflow Name"



                        value={form.workflowName ?? ""}



                        onChange={event =>



                            update(



                                "workflowName",



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



                        value={form.triggerType ?? "Manual"}



                        onChange={event =>



                            update(



                                "triggerType",



                                event.target.value as Workflow["triggerType"],



                            )



                        }



                    >







                        <option value="Manual">



                            Manual



                        </option>









                        <option value="Event">



                            Event



                        </option>









                        <option value="Schedule">



                            Schedule



                        </option>







                    </select>









                    <input



                        className="w-full rounded border p-2"



                        placeholder="Entity Type"



                        value={form.entityType ?? ""}



                        onChange={event =>



                            update(



                                "entityType",



                                event.target.value,



                            )



                        }



                    />









                    <input



                        className="w-full rounded border p-2"



                        placeholder="Action Type"



                        value={form.actionType ?? ""}



                        onChange={event =>



                            update(



                                "actionType",



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



                                event.target.value as Workflow["status"],



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