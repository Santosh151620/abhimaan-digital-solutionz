"use client";

import {
    useState,
} from "react";

import type {
    Organization,
} from "@/types/admin/Organization";


interface OrganizationFormProps {

    organization?: Organization;

    onSubmit(
        data: Partial<Organization>
    ): Promise<void>;

    onCancel?(): void;

}


export default function OrganizationForm({

    organization,

    onSubmit,

    onCancel,

}: OrganizationFormProps) {


    const [name, setName] =
        useState(
            organization?.name ?? ""
        );


    const [code, setCode] =
        useState(
            organization?.code ?? ""
        );


    const [email, setEmail] =
        useState(
            organization?.email ?? ""
        );


    const [status, setStatus] =
        useState(
            organization?.status ?? "Active"
        );


    const [loading, setLoading] =
        useState(false);



    async function submit(
        event: React.FormEvent
    ) {

        event.preventDefault();


        setLoading(true);


        try {


            await onSubmit({

                name,

                code,

                email,

                status,

            });


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

                    Organization Name

                </label>


                <input

                    value={name}

                    onChange={
                        event =>
                            setName(
                                event.target.value
                            )
                    }

                    required

                    className="mt-2 w-full rounded-lg border px-3 py-2"

                />

            </div>



            <div>

                <label className="text-sm font-medium">

                    Code

                </label>


                <input

                    value={code}

                    onChange={
                        event =>
                            setCode(
                                event.target.value
                            )
                    }

                    required

                    className="mt-2 w-full rounded-lg border px-3 py-2"

                />

            </div>



            <div>

                <label className="text-sm font-medium">

                    Email

                </label>


                <input

                    type="email"

                    value={email}

                    onChange={
                        event =>
                            setEmail(
                                event.target.value
                            )
                    }

                    className="mt-2 w-full rounded-lg border px-3 py-2"

                />

            </div>



            <div>

                <label className="text-sm font-medium">

                    Status

                </label>


                <select

                    value={status}

                    onChange={
                        event =>
                            setStatus(
                                event.target.value as Organization["status"]
                            )
                    }

                    className="mt-2 w-full rounded-lg border px-3 py-2"

                >

                    <option value="Active">
                        Active
                    </option>

                    <option value="Suspended">
                        Suspended
                    </option>

                    <option value="Archived">
                        Archived
                    </option>


                </select>

            </div>




            <div className="flex gap-3">


                <button

                    type="submit"

                    disabled={loading}

                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"

                >

                    {
                        loading
                            ? "Saving..."
                            : organization
                                ? "Update Organization"
                                : "Create Organization"
                    }

                </button>



                {
                    onCancel && (

                        <button

                            type="button"

                            onClick={onCancel}

                            className="rounded-lg border px-4 py-2"

                        >

                            Cancel

                        </button>

                    )
                }


            </div>


        </form>

    );

}
