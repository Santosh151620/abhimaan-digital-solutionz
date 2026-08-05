"use client";

import {
    useState,
} from "react";


import type {
    Permission,
    PermissionType,
} from "@/types/admin/Permission";


interface PermissionDialogProps {

    initialData?: Permission;

    onSubmit: (
        permission: Permission,
    ) => Promise<void>;

    onClose: () => void;

    saving?: boolean;

}

const defaultPermission: Partial<Permission> = {

    module: "",

    action: "",

    key: "",

    name: "",

    description: "",

    type: "System",

    isSystem: true,

    isActive: true,

};


export default function PermissionDialog({

    initialData,
    onSubmit,
    onClose,
    saving = false,
}: PermissionDialogProps) {

   
    const [loading, setLoading] =
        useState(false);

    const [form, setForm] =
        useState<Partial<Permission>>(
            initialData ?? defaultPermission
        );

    function update<K extends keyof Permission>(
        key: K,
        value: Permission[K],
    ) {

        setForm(previous => ({
            ...previous,
            [key]: value,
        }));

    }

    async function submit() {
        setLoading(true);
        try {
           await onSubmit(
    {
        ...form,

        id:
            form.id ??
            crypto.randomUUID(),

        module:
            form.module ?? "",

        action:
            form.action ?? "",

        key:
            form.key ?? "",

        name:
            form.name ?? "",

        type:
            form.type ?? "System",

        isSystem:
            form.isSystem ?? true,

        isActive:
            form.isActive ?? true,

    } as Permission,
);

        }

        finally {

            setLoading(false);

        }

    }


return (

    <>

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
                        space-y-5
                        rounded-xl
                        bg-background
                        p-6
                        shadow-xl
                        "
                    >


                        <h2 className="text-xl font-semibold">

                            Create Permission

                        </h2>



                        <div>


                            <label className="text-sm font-medium">

                                Name

                            </label>


                            <input

                                value={
                                    form.name ?? ""
                                }

                                onChange={(e) =>
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

                            />

                        </div>




                        <div>


                            <label className="text-sm font-medium">

                                Permission Key

                            </label>


                            <input

                                value={
                                    form.key ?? ""
                                }

                                onChange={(e) =>
                                    update(
                                        "key",
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





                        <div className="grid gap-4 md:grid-cols-2">


                            <div>

                                <label className="text-sm font-medium">

                                    Module

                                </label>


                                <input

                                    value={
                                        form.module ?? ""
                                    }


                                    onChange={(e) =>
                                        update(
                                            "module",
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




                            <div>

                                <label className="text-sm font-medium">

                                    Action

                                </label>


                                <input

                                    value={
                                        form.action ?? ""
                                    }


                                    onChange={(e) =>
                                        update(
                                            "action",
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


                        </div>





                        <div>


                            <label className="text-sm font-medium">

                                Type

                            </label>


                            <select

                                value={
                                    form.type
                                }

                                onChange={(e) =>
                                    update(
                                        "type",
                                        e.target.value as PermissionType,
                                    )
                                }

                                className="
                                mt-1
                                w-full
                                rounded-md
                                border
                                p-2
                                "

                            >

                                <option value="System">
                                    System
                                </option>

                                <option value="Custom">
                                    Custom
                                </option>

                                                    </select>


                        </div>




                        <div className="flex justify-end gap-3">


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



                            <button

                                type="button"

                                disabled={loading || saving}

                                onClick={submit}

                                className="
                                rounded-md
                                bg-primary
                                px-4
                                py-2
                                text-primary-foreground
                                "

                            >

                                {
                                    saving
                                        ? "Saving..."
                                        : "Save"
                                }

                            </button>

                        </div>
                    </div>
                </div>
                    </>
    );

}