"use client";

import { useState } from "react";

import type {
    Department,
} from "@/types/admin/Department";

import {
    saveDepartment,
} from "@/app/admin/(protected)/departments/actions";

interface DepartmentDialogProps {
    initialData?: Department;
}

const defaultDepartment: Department = {
    id: "",
    organizationId: "",
    departmentCode: "",
    departmentName: "",
    parentDepartmentId: undefined,
    managerId: undefined,
    status: "Active",
    metadata: {},
    createdAt: "",
    updatedAt: "",
};

export default function DepartmentDialog({
    initialData,
}: DepartmentDialogProps) {

    const [open, setOpen] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [form, setForm] =
        useState<Department>(
            initialData ?? defaultDepartment,
        );

    function update<K extends keyof Department>(
        key: K,
        value: Department[K],
    ) {
        setForm(previous => ({
            ...previous,
            [key]: value,
        }));
    }

    async function submit() {

        setLoading(true);

        try {

            const now =
                new Date().toISOString();

            await saveDepartment({
                ...form,
                id:
                    form.id ||
                    crypto.randomUUID(),
                createdAt:
                    form.createdAt ||
                    now,
                updatedAt:
                    now,
            });

            setOpen(false);

        } finally {

            setLoading(false);

        }

    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="rounded-md bg-blue-600 px-4 py-2 text-white"
            >
                {initialData
                    ? "Edit Department"
                    : "New Department"}
            </button>

            {open && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

                    <div className="w-full max-w-lg rounded-lg bg-white p-6">

                        <h2 className="mb-6 text-xl font-semibold">
                            {initialData
                                ? "Edit Department"
                                : "Create Department"}
                        </h2>

                        <div className="space-y-4">

                            <input
                                className="w-full rounded border p-2"
                                placeholder="Department Code"
                                value={form.departmentCode}
                                onChange={(e) =>
                                    update(
                                        "departmentCode",
                                        e.target.value,
                                    )
                                }
                            />

                            <input
                                className="w-full rounded border p-2"
                                placeholder="Department Name"
                                value={form.departmentName}
                                onChange={(e) =>
                                    update(
                                        "departmentName",
                                        e.target.value,
                                    )
                                }
                            />

                            <select
                                className="w-full rounded border p-2"
                                value={form.status}
                                onChange={(e) =>
                                    update(
                                        "status",
                                        e.target.value as Department["status"],
                                    )
                                }
                            >
                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>

                            </select>

                        </div>

                        <div className="mt-6 flex justify-end gap-2">

                            <button
                                onClick={() => setOpen(false)}
                                className="rounded border px-4 py-2"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={loading}
                                onClick={submit}
                                className="rounded bg-blue-600 px-4 py-2 text-white"
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );

}