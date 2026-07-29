"use client";

import {
    useState,
} from "react";

import type {
    Role,
    RoleLevel,
    RoleStatus,
    RoleType,
} from "@/types/admin/Role";


interface RoleFormProps {

    initialData?: Partial<Role>;

    onSubmit: (
        data: Partial<Role>
    ) => Promise<void>;

    onCancel?: () => void;

}


export default function RoleForm({

    initialData,

    onSubmit,

    onCancel,

}: RoleFormProps) {


    const [form, setForm] =
        useState<Partial<Role>>({

            name:
                initialData?.name ?? "",

            code:
                initialData?.code ?? "",

            description:
                initialData?.description ?? "",

            type:
                initialData?.type ?? "Organization",

            level:
                initialData?.level ?? "Organization",

            status:
                initialData?.status ?? "Active",

            permissionIds:
                initialData?.permissionIds ?? [],

            isSystem:
                initialData?.isSystem ?? false,

            isDefault:
                initialData?.isDefault ?? false,

            isActive:
                initialData?.isActive ?? true,

            ...initialData,

        });


    const [loading,setLoading] =
        useState(false);



    function update<K extends keyof Role>(

        key: K,

        value: Role[K],

    ){

        setForm(previous => ({

            ...previous,

            [key]: value,

        }));

    }



    async function submit(

        event: React.FormEvent

    ){

        event.preventDefault();

        setLoading(true);


        try {

            await onSubmit(form);

        }

        finally {

            setLoading(false);

        }

    }



    return (

        <form
            onSubmit={submit}
            className="space-y-5 rounded-xl border p-6"
        >


            <div>

                <label className="text-sm font-medium">
                    Role Name
                </label>

                <input

                    value={form.name ?? ""}

                    onChange={(event)=>
                        update(
                            "name",
                            event.target.value,
                        )
                    }

                    className="mt-1 w-full rounded-md border p-2"

                    required

                />

            </div>



            <div>

                <label className="text-sm font-medium">
                    Role Code
                </label>


                <input

                    value={form.code ?? ""}

                    onChange={(event)=>
                        update(
                            "code",
                            event.target.value,
                        )
                    }

                    className="mt-1 w-full rounded-md border p-2"

                    required

                />

            </div>




            <div>

                <label className="text-sm font-medium">
                    Description
                </label>


                <textarea

                    value={form.description ?? ""}

                    onChange={(event)=>
                        update(
                            "description",
                            event.target.value,
                        )
                    }

                    className="mt-1 w-full rounded-md border p-2"

                />

            </div>




            <div className="grid gap-4 md:grid-cols-3">


                <select

                    value={form.type}

                    onChange={(event)=>
                        update(
                            "type",
                            event.target.value as RoleType,
                        )
                    }

                    className="rounded-md border p-2"

                >

                    <option value="System">
                        System
                    </option>

                    <option value="Organization">
                        Organization
                    </option>

                    <option value="Custom">
                        Custom
                    </option>


                </select>



                <select

                    value={form.level}

                    onChange={(event)=>
                        update(
                            "level",
                            event.target.value as RoleLevel,
                        )
                    }

                    className="rounded-md border p-2"

                >

                    <option value="Platform">
                        Platform
                    </option>

                    <option value="Organization">
                        Organization
                    </option>

                    <option value="Department">
                        Department
                    </option>

                    <option value="Module">
                        Module
                    </option>


                </select>




                <select

                    value={form.status}

                    onChange={(event)=>
                        update(
                            "status",
                            event.target.value as RoleStatus,
                        )
                    }

                    className="rounded-md border p-2"

                >

                    <option value="Active">
                        Active
                    </option>

                    <option value="Inactive">
                        Inactive
                    </option>

                    <option value="Archived">
                        Archived
                    </option>


                </select>


            </div>




            <div className="flex justify-end gap-3">


                {onCancel && (

                    <button

                        type="button"

                        onClick={onCancel}

                        className="rounded border px-4 py-2"

                    >

                        Cancel

                    </button>

                )}



                <button

                    disabled={loading}

                    className="rounded bg-primary px-4 py-2 text-primary-foreground"

                >

                    {loading
                        ? "Saving..."
                        : "Save Role"}

                </button>


            </div>


        </form>

    );

}
