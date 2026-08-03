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



interface RoleDialogProps {

    initialData?: Partial<Role>;

    onSubmit?: (
        data: Partial<Role>
    ) => Promise<void>;

    onClose?: () => void;

}



export default function RoleDialog({

    initialData,

    onSubmit,

    onClose,

}: RoleDialogProps) {



    const [open, setOpen] =
        useState(false);



    const [loading, setLoading] =
        useState(false);



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



    function update<K extends keyof Role>(

        key: K,

        value: Role[K],

    ) {


        setForm(previous => ({

            ...previous,

            [key]: value,

        }));

    }




    async function submit(

        event: React.FormEvent,

    ) {


        event.preventDefault();



        if (!onSubmit) {

            setOpen(false);

            return;

        }



        setLoading(true);


        try {


            await onSubmit(
                form,
            );


            setOpen(false);



        }

        finally {


            setLoading(false);


        }


    }





    return (

        <>


            <button

                type="button"

                onClick={() => setOpen(true)}

                className="
                rounded-md
                bg-primary
                px-4
                py-2
                text-primary-foreground
                "

            >

                Add Role

            </button>




            {open && (


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



                    <form

                        onSubmit={submit}

                        className="
                        w-full
                        max-w-lg
                        space-y-5
                        rounded-xl
                        bg-background
                        p-6
                        shadow-xl
                        "

                    >



                        <h2 className="text-xl font-semibold">

                            {initialData?.id
                                ? "Edit Role"
                                : "Create Role"}

                        </h2>




                        <div>


                            <label className="text-sm font-medium">

                                Name

                            </label>


                            <input

                                value={
                                    form.name ?? ""
                                }


                                onChange={
                                    e =>
                                        update(
                                            "name",
                                            e.target.value,
                                        )
                                }


                                className="
                                mt-1
                                w-full
                                rounded-md
                                border
                                p-2
                                "

                                required

                            />

                        </div>





                        <div>


                            <label className="text-sm font-medium">

                                Code

                            </label>


                            <input

                                value={
                                    form.code ?? ""
                                }


                                onChange={
                                    e =>
                                        update(
                                            "code",
                                            e.target.value
                                                .toUpperCase(),
                                        )
                                }


                                className="
                                mt-1
                                w-full
                                rounded-md
                                border
                                p-2
                                "

                                required

                            />


                        </div>





                        <div>


                            <label className="text-sm font-medium">

                                Description

                            </label>


                            <textarea

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


                                className="
                                mt-1
                                w-full
                                rounded-md
                                border
                                p-2
                                "

                            />


                        </div>





                        <div className="grid gap-4 md:grid-cols-3">


                            <select

                                value={form.type}

                                onChange={
                                    e =>
                                        update(
                                            "type",
                                            e.target.value as RoleType,
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

                                onChange={
                                    e =>
                                        update(
                                            "level",
                                            e.target.value as RoleLevel,
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

                                onChange={
                                    e =>
                                        update(
                                            "status",
                                            e.target.value as RoleStatus,
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


                            {onClose && (

                                <button

                                    type="button"

                                    onClick={onClose}

                                    className="
                                    rounded-md
                                    border
                                    px-4
                                    py-2
                                    "

                                >

                                    Cancel

                                </button>

                            )}





                            <button

                                type="submit"

                                disabled={loading}

                                className="
                                rounded-md
                                bg-primary
                                px-4
                                py-2
                                text-primary-foreground
                                "

                            >

                                {loading
                                    ? "Saving..."
                                    : "Save Role"}

                            </button>


                        </div>


                    </form>


                </div>


            )}


        </>


    );

}