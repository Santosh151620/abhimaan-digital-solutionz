"use client";

import {
    useState,
} from "react";

import type {
    Designation,
} from "@/types/admin/Designation";

import {
    saveDesignation,
} from "@/app/admin/(protected)/designations/actions";

interface DesignationDialogProps {

    initialData?:Designation;

}

const defaultDesignation:Partial<Designation> = {

    designationCode:"",
    designationName:"",
    status:"Active",
    metadata:{},

};

export default function DesignationDialog({

    initialData,

}:DesignationDialogProps) {

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

    ] = useState<Partial<Designation>>(

        initialData ?? defaultDesignation,

    );

    function update<

        K extends keyof Designation

    >(

        key:K,

        value:Designation[K],

    ) {

        setForm(

            previous => ({

                ...previous,

                [key]:value,

            }),

        );

    }

    async function submit() {

        setLoading(true);

        try {

            await saveDesignation(

                form,

            );

            setOpen(false);

            location.reload();

        }

        finally {

            setLoading(false);

        }

    }

    if(!open) {

        return (

            <button

                className="rounded bg-blue-600 px-4 py-2 text-white"

                onClick={() => setOpen(true)}

            >

                New Designation

            </button>

        );

    }

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">

                <h2 className="mb-6 text-xl font-semibold">

                    {

                        initialData

                            ? "Edit Designation"

                            : "New Designation"

                    }

                </h2>

                <div className="space-y-4">

                    <input

                        className="w-full rounded border p-2"

                        placeholder="Designation Code"

                        value={form.designationCode ?? ""}

                        onChange={event =>

                            update(

                                "designationCode",

                                event.target.value,

                            )

                        }

                    />

                    <input

                        className="w-full rounded border p-2"

                        placeholder="Designation Name"

                        value={form.designationName ?? ""}

                        onChange={event =>

                            update(

                                "designationName",

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

                                event.target.value as Designation["status"],

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