"use client";

import {
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import type {
    Organization,
} from "@/types/admin/Organization";

import OrganizationDialog
from "./OrganizationDialog";

import OrganizationsTable
from "./OrganizationsTable";

import {
    deleteOrganization,
} from "@/app/admin/(protected)/organizations/actions";

interface OrganizationsClientProps {

    organizations: Organization[];

}

export default function OrganizationsClient({

    organizations,

}: OrganizationsClientProps) {

    const router =
        useRouter();

    const [
        selectedOrganization,
        setSelectedOrganization,
    ] =
    useState<Organization>();

    const [
        dialogOpen,
        setDialogOpen,
    ] =
    useState(false);

    const [
        deleting,
        setDeleting,
    ] =
    useState(false);

    const [
        error,
        setError,
    ] =
    useState<string | null>(
        null,
    );

    function openCreate() {

        setSelectedOrganization(
            undefined,
        );

        setDialogOpen(
            true,
        );

        setError(
            null,
        );

    }

    function openEdit(
        organization: Organization,
    ) {

        setSelectedOrganization(
            organization,
        );

        setDialogOpen(
            true,
        );

        setError(
            null,
        );

    }

    function closeDialog() {

        setDialogOpen(
            false,
        );

        setSelectedOrganization(
            undefined,
        );

    }

    async function handleDelete(
        id: string,
    ) {

        if (
            !window.confirm(
                "Delete this organization?",
            )
        ) {

            return;

        }

        try {

            setDeleting(
                true,
            );

            setError(
                null,
            );

            await deleteOrganization(
                id,
            );

            router.refresh();

        }
        catch (error) {

            setError(

                error instanceof Error
                    ? error.message
                    : "Unable to delete organization.",

            );

        }
        finally {

            setDeleting(
                false,
            );

        }

    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-semibold">

                        Organizations

                    </h2>

                    <p className="text-sm text-muted-foreground">

                        Manage tenants, subscriptions and platform organizations.

                    </p>

                </div>

                <button

                    onClick={openCreate}

                    className="rounded-md bg-primary px-4 py-2 text-primary-foreground"

                >

                    Add Organization

                </button>

            </div>

            {error && (

                <div className="rounded-md border border-destructive p-3 text-sm text-destructive">

                    {error}

                </div>

            )}

          <OrganizationsTable

    organizations={organizations}

    onEdit={openEdit}

    onDelete={handleDelete}

/>
            {dialogOpen && (

                <OrganizationDialog

                    organization={
                        selectedOrganization
                    }

                    onClose={
                        closeDialog
                    }

                />

            )}

            {deleting && (

                <div className="fixed bottom-6 right-6 rounded-md border bg-background px-4 py-2 shadow">

                    Deleting organization...

                </div>

            )}

        </div>

    );

}