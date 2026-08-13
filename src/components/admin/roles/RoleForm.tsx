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
        data: Partial<Role>,
    ) => Promise<void>;

    onCancel?: () => void;

}


export default function RoleForm({

    initialData,

    onSubmit,

    onCancel,

}: RoleFormProps) {


    const [
        form,
        setForm,
    ] = useState<Partial<Role>>({

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


    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState<string | null>(null);



    function update<K extends keyof Role>(

        key: K,

        value: Role[K],

    ) {

        setForm(
            previous => ({

                ...previous,

                [key]: value,

            }),
        );

    }



    async function submit(

        event: React.FormEvent,

    ) {

        event.preventDefault();

        setError(null);


        if (!form.name?.trim()) {

            setError(
                "Role name is required.",
            );

            return;

        }


        if (!form.code?.trim()) {

            setError(
                "Role code is required.",
            );

            return;

        }


        try {

            setLoading(true);


            await onSubmit({

                ...form,

                name:
                    form.name.trim(),

                code:
                    form.code
                        .trim()
                        .toLowerCase(),

                description:
                    form.description?.trim(),

            });


        }
        catch (error) {

            setError(

                error instanceof Error

                    ? error.message

                    : "Unable to save role.",

            );

        }
        finally {

            setLoading(false);

        }

    }



    return (

        <form

            onSubmit={submit}

            className="
                space-y-5
                rounded-xl
                border
                p-6
            "

        >


            {
                error && (

                    <div

                        className="
                            rounded-md
                            border
                            border-destructive
                            p-3
                            text-sm
                            text-destructive
                        "

                    >

                        {error}

                    </div>

                )
            }



            <div>

                <label className="text-sm font-medium">

                    Role Name

                </label>


                <input

                    value={
                        form.name ?? ""
                    }

                    onChange={event =>
                        update(
                            "name",
                            event.target.value,
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

                    Role Code

                </label>


                <input

                    value={
                        form.code ?? ""
                    }

                    disabled={
                        form.isSystem
                    }

                    onChange={event =>
                        update(
                            "code",
                            event.target.value,
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

                    onChange={event =>
                        update(
                            "description",
                            event.target.value,
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

                    value={
                        form.type ?? "Organization"
                    }

                    disabled={
                        form.isSystem
                    }

                    onChange={event =>
                        update(
                            "type",
                            event.target.value as RoleType,
                        )
                    }

                    className="
                        rounded-md
                        border
                        p-2
                    "

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

                    value={
                        form.level ?? "Organization"
                    }

                    onChange={event =>
                        update(
                            "level",
                            event.target.value as RoleLevel,
                        )
                    }

                    className="
                        rounded-md
                        border
                        p-2
                    "

                >

                    <option value="Platform">
                        Platform
                    </option>


                    <option value="Application">
                        Application
                    </option>


                    <option value="Organization">
                        Organization
                    </option>


                    <option value="Department">
                        Department
                    </option>


                    <option value="Team">
                        Team
                    </option>


                </select>




                <select

                    value={
                        form.status ?? "Active"
                    }

                    onChange={event =>
                        update(
                            "status",
                            event.target.value as RoleStatus,
                        )
                    }

                    className="
                        rounded-md
                        border
                        p-2
                    "

                >

                    <option value="Active">
                        Active
                    </option>


                    <option value="Inactive">
                        Inactive
                    </option>


                    <option value="Suspended">
                        Suspended
                    </option>


                    <option value="Archived">
                        Archived
                    </option>


                </select>


            </div>




            <div className="flex justify-end gap-3">


                {
                    onCancel && (

                        <button

                            type="button"

                            onClick={onCancel}

                            disabled={loading}

                            className="
                                rounded
                                border
                                px-4
                                py-2
                            "

                        >

                            Cancel

                        </button>

                    )
                }



                <button

                    type="submit"

                    disabled={loading}

                    className="
                        rounded
                        bg-primary
                        px-4
                        py-2
                        text-primary-foreground
                    "

                >

                    {
                        loading

                            ? "Saving..."

                            : "Save Role"
                    }

                </button>


            </div>


        </form>

    );

}