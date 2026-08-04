"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type {
    Permission,
} from "@/types/admin/Permission";

import PermissionsTable from "./PermissionsTable";
import PermissionDialog from "./PermissionDialog";

import {
    savePermission,
    deletePermission,
} from "@/app/admin/(protected)/permissions/actions";

interface PermissionsClientProps {
    permissions: Permission[];
}

export default function PermissionsClient({
    permissions,
}: PermissionsClientProps) {

    const router = useRouter();

    const [selectedPermission, setSelectedPermission] =
        useState<Permission | undefined>();

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [isPending, startTransition] =
        useTransition();

    function handleCreate() {

        setSelectedPermission(undefined);

        setDialogOpen(true);

    }

    function handleEdit(
        permission: Permission,
    ) {

        setSelectedPermission(permission);

        setDialogOpen(true);

    }

    function handleClose() {

        setDialogOpen(false);

        setSelectedPermission(undefined);

    }

    async function handleSubmit(
        permission: Permission,
    ) {

        await savePermission(permission);

        handleClose();

        startTransition(() => {

            router.refresh();

        });

    }

    async function handleDelete(
        id: string,
    ) {

        const confirmed =
            window.confirm(
                "Delete this permission?"
            );

        if (!confirmed) {

            return;

        }

        await deletePermission(id);

        startTransition(() => {

            router.refresh();

        });

    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">

                        Permissions

                    </h1>

                    <p className="text-muted-foreground">

                        Manage platform permissions and RBAC rules.

                    </p>

                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
                >

                    Add Permission

                </button>

            </div>

            <PermissionsTable
                permissions={permissions}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {dialogOpen && (

                <PermissionDialog
                    initialData={selectedPermission}
                    onSubmit={handleSubmit}
                    onClose={handleClose}
                    saving={isPending}
                />

            )}

        </div>

    );

}