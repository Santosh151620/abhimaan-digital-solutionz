"use client";

import {
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import type {
    Permission,
    PermissionType,
} from "@/types/admin/Permission";

import {
    createPermission,
    updatePermission,
} from "@/app/admin/(protected)/permissions/actions";


interface PermissionDialogProps {

    permission?: Permission;

    onClose: () => void;

}


const defaultForm: Partial<Permission> = {

    key: "",

    name: "",

    description: "",

    module: "",

    action: "",

    type: "Custom",

    isSystem: false,

    isActive: true,

};



export default function PermissionDialog({

    permission,

    onClose,

}: PermissionDialogProps) {


    const router =
        useRouter();


    const [
        form,
        setForm,
    ] = useState<Partial<Permission>>({

        ...defaultForm,

        ...permission,

    });



    const [
        loading,
        setLoading,
    ] = useState(false);



    const [
        error,
        setError,
    ] = useState<string | null>(null);



    function updateField<K extends keyof Permission>(

        key: K,

        value: Permission[K],

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



        if (!form.key?.trim()) {

            setError(
                "Permission key is required.",
            );

            return;

        }


        if (!form.name?.trim()) {

            setError(
                "Permission name is required.",
            );

            return;

        }


        if (!form.module?.trim()) {

            setError(
                "Module is required.",
            );

            return;

        }


        if (!form.action?.trim()) {

            setError(
                "Action is required.",
            );

            return;

        }



        try {

            setLoading(true);



            const payload: Partial<Permission> = {

                ...form,

                key:
                    form.key.trim()
                        .toLowerCase(),

                name:
                    form.name.trim(),

                module:
                    form.module.trim(),

                action:
                    form.action.trim(),

                description:
                    form.description?.trim(),

            };



            if (permission) {

                await updatePermission({

                    ...permission,

                    ...payload,

                } as Permission);

            }

            else {

                await createPermission(

                    payload,

                );

            }



            router.refresh();

            onClose();


        }

        catch (error) {

            setError(

                error instanceof Error

                    ? error.message

                    : "Unable to save permission.",

            );

        }

        finally {

            setLoading(false);

        }

    }



    return (

        <div

            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                p-4
            "

        >

            <form

                onSubmit={submit}

                className="
                    w-full
                    max-w-xl
                    rounded-xl
                    bg-background
                    p-6
                    space-y-5
                    shadow-xl
                "

            >


                <h2 className="text-xl font-semibold">

                    {
                        permission
                            ? "Edit Permission"
                            : "Create Permission"
                    }

                </h2>



                {
                    error && (

                        <div

                            className="
                                rounded-md
                                border
                                border-destructive
                                p-3
                                text-destructive
                            "

                        >

                            {error}

                        </div>

                    )
                }



                <input

                    className="
                        w-full
                        rounded-md
                        border
                        p-2
                    "

                    placeholder="Permission Key"

                    disabled={
                        permission?.isSystem
                    }

                    value={
                        form.key ?? ""
                    }

                    onChange={event =>
                        updateField(
                            "key",
                            event.target.value,
                        )
                    }

                />



                <input

                    className="
                        w-full
                        rounded-md
                        border
                        p-2
                    "

                    placeholder="Permission Name"

                    value={
                        form.name ?? ""
                    }

                    onChange={event =>
                        updateField(
                            "name",
                            event.target.value,
                        )
                    }

                />



                <input

                    className="
                        w-full
                        rounded-md
                        border
                        p-2
                    "

                    placeholder="Module"

                    value={
                        form.module ?? ""
                    }

                    onChange={event =>
                        updateField(
                            "module",
                            event.target.value,
                        )
                    }

                />



                <input

                    className="
                        w-full
                        rounded-md
                        border
                        p-2
                    "

                    placeholder="Action"

                    value={
                        form.action ?? ""
                    }

                    onChange={event =>
                        updateField(
                            "action",
                            event.target.value,
                        )
                    }

                />



                <textarea

                    className="
                        w-full
                        rounded-md
                        border
                        p-2
                    "

                    placeholder="Description"

                    value={
                        form.description ?? ""
                    }

                    onChange={event =>
                        updateField(
                            "description",
                            event.target.value,
                        )
                    }

                />



                <select

                    className="
                        w-full
                        rounded-md
                        border
                        p-2
                    "

                    value={
                        form.type ?? "Custom"
                    }

                    disabled={
                        permission?.isSystem
                    }

                    onChange={event =>
                        updateField(
                            "type",
                            event.target.value as PermissionType,
                        )
                    }

                >

                    <option value="System">

                        System

                    </option>


                    <option value="Custom">

                        Custom

                    </option>


                </select>



                <div className="flex justify-end gap-3">


                    <button

                        type="button"

                        onClick={onClose}

                        disabled={loading}

                        className="
                            rounded-md
                            border
                            px-4
                            py-2
                        "

                    >

                        Cancel

                    </button>



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

                        {
                            loading

                                ? "Saving..."

                                : "Save"
                        }

                    </button>


                </div>


            </form>


        </div>

    );

}