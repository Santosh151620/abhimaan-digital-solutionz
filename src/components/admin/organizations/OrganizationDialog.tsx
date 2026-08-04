"use client";

import {
    useState,
} from "react";

import type {
    Organization,
    OrganizationStatus,
    OrganizationType,
} from "@/types/admin/Organization";

import {
    createOrganization,
    updateOrganization,
} from "@/app/admin/(protected)/organizations/actions";

interface OrganizationDialogProps {

    organization?: Organization;

    onClose: () => void;

}

export default function OrganizationDialog({

    organization,

    onClose,

}: OrganizationDialogProps) {

    const [

        loading,

        setLoading,

    ] =
        useState(false);

    const [

        form,

        setForm,

    ] =
        useState<Partial<Organization>>({

            name:
                organization?.name ?? "",

            code:
                organization?.code ?? "",

            legalName:
                organization?.legalName ?? "",

            displayName:
                organization?.displayName ?? "",

            description:
                organization?.description ?? "",

            email:
                organization?.email ?? "",

            phone:
                organization?.phone ?? "",

            website:
                organization?.website ?? "",

            city:
                organization?.city ?? "",

            state:
                organization?.state ?? "",

            country:
                organization?.country ?? "",

            type:
                organization?.type
                ?? "Customer",

            status:
                organization?.status
                ?? "Active",

            isActive:
                organization?.isActive
                ?? true,

            isSystem:
                organization?.isSystem
                ?? false,

        });

    function updateField<

        K extends keyof Organization

    >(

        key: K,

        value: Organization[K],

    ) {

        setForm(

            previous => ({

                ...previous,

                [key]: value,

            }),

        );

    }

    async function submit() {
        if (!form.name?.trim()) {

            alert(
                "Organization name is required.",
            );

            return;

        }

        if (!form.code?.trim()) {

            alert(
                "Organization code is required.",
            );

            return;

        }
        setLoading(
            true,
        );

        try {

            if (

                organization

            ) {

                await updateOrganization({

                    ...organization,

                    ...form,

                } as Organization);

            }
            else {

                await createOrganization(
                    form,
                );

            }

            onClose();

        }
        catch (error) {

            console.error(error);

            alert(

                error instanceof Error
                    ? error.message
                    : "Unable to save organization.",

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
            "
        >

            <div
                className="
                    w-full
                    max-w-3xl
                    rounded-xl
                    bg-background
                    p-6
                    shadow-xl
                    space-y-6
                "
            >

                <div>

                    <h2
                        className="
                            text-2xl
                            font-bold
                        "
                    >

                        {

                            organization
                                ? "Edit Organization"
                                : "Create Organization"

                        }

                    </h2>

                    <p
                        className="
                            text-sm
                            text-muted-foreground
                        "
                    >

                        Manage organization identity,
                        contact information and lifecycle.

                    </p>

                </div>

                <div
                    className="
                        grid
                        gap-4
                        md:grid-cols-2
                    "
                >

                    <input

                        className="rounded border p-2"

                        placeholder="Organization Name"

                        value={form.name ?? ""}

                        onChange={event =>

                            updateField(

                                "name",

                                event.target.value,

                            )

                        }

                    />

                    <input

                        className="rounded border p-2"

                        placeholder="Organization Code"

                        value={form.code ?? ""}

                        onChange={event =>

                            updateField(

                                "code",

                                event.target.value,

                            )

                        }

                    />

                    <input

                        className="rounded border p-2"

                        placeholder="Legal Name"

                        value={form.legalName ?? ""}

                        onChange={event =>

                            updateField(

                                "legalName",

                                event.target.value,

                            )

                        }

                    />

                    <input

                        className="rounded border p-2"

                        placeholder="Display Name"

                        value={form.displayName ?? ""}

                        onChange={event =>

                            updateField(

                                "displayName",

                                event.target.value,

                            )

                        }

                    />

                    <input

                        className="rounded border p-2"

                        placeholder="Email"

                        value={form.email ?? ""}

                        onChange={event =>

                            updateField(

                                "email",

                                event.target.value,

                            )

                        }

                    />

                    <input

                        className="rounded border p-2"

                        placeholder="Phone"

                        value={form.phone ?? ""}

                        onChange={event =>

                            updateField(

                                "phone",

                                event.target.value,

                            )

                        }

                    />

                    <input

                        className="rounded border p-2"

                        placeholder="Website"

                        value={form.website ?? ""}

                        onChange={event =>

                            updateField(

                                "website",

                                event.target.value,

                            )

                        }

                    />

                    <input

                        className="rounded border p-2"

                        placeholder="City"

                        value={form.city ?? ""}

                        onChange={event =>

                            updateField(

                                "city",

                                event.target.value,

                            )

                        }

                    />

                    <input

                        className="rounded border p-2"

                        placeholder="State"

                        value={form.state ?? ""}

                        onChange={event =>

                            updateField(

                                "state",

                                event.target.value,

                            )

                        }

                    />

                    <input

                        className="rounded border p-2"

                        placeholder="Country"

                        value={form.country ?? ""}

                        onChange={event =>

                            updateField(

                                "country",

                                event.target.value,

                            )

                        }

                    />

                    <select

                        className="rounded border p-2"

                        value={form.type}

                        onChange={event =>

                            updateField(

                                "type",

                                event.target.value as OrganizationType,

                            )

                        }

                    >

                        <option value="Customer">Customer</option>

                        <option value="Partner">Partner</option>

                        <option value="Internal">Internal</option>

                        <option value="Vendor">Vendor</option>

                        <option value="Demo">Demo</option>

                    </select>

                    <select

                        className="rounded border p-2"

                        value={form.status}

                        onChange={event =>

                            updateField(

                                "status",

                                event.target.value as OrganizationStatus,

                            )

                        }

                    >

                        <option value="Active">Active</option>

                        <option value="Inactive">Inactive</option>

                        <option value="Pending">Pending</option>

                        <option value="Suspended">Suspended</option>

                        <option value="Archived">Archived</option>

                    </select>

                </div>
                <div
                    className="
                        flex
                        justify-end
                        gap-3
                        border-t
                        pt-6
                    "
                >

                    <button

                        type="button"

                        onClick={
                            onClose
                        }

                        disabled={
                            loading
                        }

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

                        onClick={
                            submit
                        }

                        disabled={
                            loading
                        }

                        className="
                            rounded-md
                            bg-primary
                            px-5
                            py-2
                            text-primary-foreground
                        "

                    >

                        {

                            loading
                                ? "Saving..."
                                : (
                                    organization
                                        ? "Save Changes"
                                        : "Create Organization"
                                )

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}