"use client";

import {
    useState,
} from "react";

import type {
    AdminUser,
    UserStatus,
    UserType,
} from "@/types/admin/User";


interface UserFormProps {

    initialData?: Partial<AdminUser>;

    onSubmit: (
        data: Partial<AdminUser>
    ) => Promise<void>;

    onCancel?: () => void;

}


export default function UserForm({

    initialData,

    onSubmit,

    onCancel,

}: UserFormProps) {


    const [form, setForm] = useState<Partial<AdminUser>>({

        fullName:
            initialData?.fullName ?? "",

        email:
            initialData?.email ?? "",

        phone:
            initialData?.phone ?? "",

        userType:
            initialData?.userType ?? "Internal",

        status:
            initialData?.status ?? "Pending",

        roleIds:
            initialData?.roleIds ?? [],

        ...initialData,

    });


    const [loading, setLoading] =
        useState(false);


    function update<K extends keyof AdminUser>(

        key: K,

        value: AdminUser[K],

    ) {

        setForm(previous => ({

            ...previous,

            [key]: value,

        }));

    }


    async function submit(

        event: React.FormEvent

    ) {

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
            className="space-y-5 rounded-xl border bg-background p-6"
        >

            <div>

                <label className="text-sm font-medium">
                    Full Name
                </label>

                <input
                    value={form.fullName ?? ""}
                    onChange={(event) =>
                        update(
                            "fullName",
                            event.target.value,
                        )
                    }
                    className="mt-1 w-full rounded-md border p-2"
                    required
                />

            </div>


            <div>

                <label className="text-sm font-medium">
                    Email
                </label>

                <input
                    type="email"
                    value={form.email ?? ""}
                    onChange={(event) =>
                        update(
                            "email",
                            event.target.value,
                        )
                    }
                    className="mt-1 w-full rounded-md border p-2"
                    required
                />

            </div>


            <div>

                <label className="text-sm font-medium">
                    Phone
                </label>

                <input
                    value={form.phone ?? ""}
                    onChange={(event) =>
                        update(
                            "phone",
                            event.target.value,
                        )
                    }
                    className="mt-1 w-full rounded-md border p-2"
                />

            </div>


            <div className="grid gap-4 md:grid-cols-2">


                <div>

                    <label className="text-sm font-medium">
                        User Type
                    </label>

                    <select
                        value={form.userType}
                        onChange={(event) =>
                            update(
                                "userType",
                                event.target.value as UserType,
                            )
                        }
                        className="mt-1 w-full rounded-md border p-2"
                    >

                        <option value="Internal">
                            Internal
                        </option>

                        <option value="External">
                            External
                        </option>

                        <option value="System">
                            System
                        </option>

                    </select>

                </div>


                <div>

                    <label className="text-sm font-medium">
                        Status
                    </label>

                    <select
                        value={form.status}
                        onChange={(event) =>
                            update(
                                "status",
                                event.target.value as UserStatus,
                            )
                        }
                        className="mt-1 w-full rounded-md border p-2"
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

                        <option value="Pending">
                            Pending
                        </option>

                    </select>

                </div>


            </div>


            <div className="flex justify-end gap-3">


                {onCancel && (

                    <button

                        type="button"

                        onClick={onCancel}

                        className="rounded-md border px-4 py-2"

                    >

                        Cancel

                    </button>

                )}


                <button

                    type="submit"

                    disabled={loading}

                    className="rounded-md bg-primary px-4 py-2 text-primary-foreground"

                >

                    {loading
                        ? "Saving..."
                        : "Save User"}

                </button>


            </div>


        </form>

    );

}
