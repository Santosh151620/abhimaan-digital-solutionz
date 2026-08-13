"use client";

import {
    useState,
    type FormEvent,
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


interface PermissionFormProps {

    permission?: Permission;

    onClose?: () => void;

    onSaved?: () => void;

}


interface PermissionFormState {

    key: string;

    name: string;

    description: string;

    module: string;

    action: string;

    type: PermissionType;

}


const DEFAULT_FORM: PermissionFormState = {

    key: "",

    name: "",

    description: "",

    module: "",

    action: "",

    type: "Custom",

};


function getInitialForm(
    permission?: Permission,
): PermissionFormState {

    return {

        key:
            permission?.key ?? "",

        name:
            permission?.name ?? "",

        description:
            permission?.description ?? "",

        module:
            permission?.module ?? "",

        action:
            permission?.action ?? "",

        type:
            permission?.type ?? "Custom",

    };

}


function normalizeValue(
    value: string,
): string {

    return value.trim();

}


function normalizeKey(
    value: string,
): string {

    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ".")
        .replace(/[^a-z0-9._:-]/g, "");

}


export default function PermissionForm({

    permission,

    onClose,

    onSaved,

}: PermissionFormProps) {

    const router = useRouter();

    const isEditing = Boolean(permission);

    const isSystemPermission =
        Boolean(permission?.isSystem);

    const [
        form,
        setForm,
    ] = useState<PermissionFormState>(
        () => getInitialForm(permission),
    );

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState<string | null>(null);


    function updateField<
        K extends keyof PermissionFormState
    >(
        key: K,
        value: PermissionFormState[K],
    ) {

        setForm(previous => ({

            ...previous,

            [key]: value,

        }));

    }


    function validate():
        string | null {

        if (!form.key.trim()) {

            return "Permission key is required.";

        }

        if (!form.name.trim()) {

            return "Permission name is required.";

        }

        if (!form.module.trim()) {

            return "Module is required.";

        }

        if (!form.action.trim()) {

            return "Action is required.";

        }

        if (!form.type) {

            return "Permission type is required.";

        }

        return null;

    }


    async function submit(
        event: FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault();

        if (loading) {

            return;

        }

        setError(null);

        const validationError =
            validate();

        if (validationError) {

            setError(validationError);

            return;

        }

        try {

            setLoading(true);

            const normalizedKey =
                isSystemPermission
                    ? permission?.key ?? form.key.trim()
                    : normalizeKey(form.key);

            const normalizedName =
                normalizeValue(form.name);

            const normalizedModule =
                normalizeValue(form.module);

            const normalizedAction =
                normalizeValue(form.action);

            const normalizedDescription =
                normalizeValue(form.description);


            if (!normalizedKey) {

                setError(
                    "Permission key is required.",
                );

                return;

            }


            if (isEditing && permission) {

                await updatePermission({

                    ...permission,

                    key: normalizedKey,

                    name: normalizedName,

                    module: normalizedModule,

                    action: normalizedAction,

                    description:
                        normalizedDescription || undefined,

                    type:
                        isSystemPermission
                            ? permission.type
                            : form.type,

                });

            }
            else {

                await createPermission({

                    key: normalizedKey,

                    name: normalizedName,

                    module: normalizedModule,

                    action: normalizedAction,

                    description:
                        normalizedDescription || undefined,

                    type: form.type,

                    isSystem: false,

                    isActive: true,

                });

            }


            router.refresh();

            onSaved?.();

            onClose?.();

        }
        catch (caughtError) {

            setError(

                caughtError instanceof Error

                    ? caughtError.message

                    : "Unable to save permission.",

            );

        }
        finally {

            setLoading(false);

        }

    }


    return (

        <form
            onSubmit={submit}
            noValidate
            className="space-y-6 rounded-xl border bg-background p-6 shadow-sm"
        >

            <div className="space-y-1">

                <h2 className="text-xl font-semibold">

                    {
                        isEditing
                            ? "Edit Permission"
                            : "Create Permission"
                    }

                </h2>

                <p className="text-sm text-muted-foreground">

                    Define the permission key, module,
                    action, and access type.

                </p>

            </div>


            {error && (

                <div
                    role="alert"
                    className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
                >

                    {error}

                </div>

            )}


            <div className="space-y-2">

                <label
                    htmlFor="permission-key"
                    className="text-sm font-medium"
                >

                    Permission Key

                </label>

                <input
                    id="permission-key"
                    name="key"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    value={form.key}
                    disabled={
                        loading ||
                        isSystemPermission
                    }
                    onChange={event =>
                        updateField(
                            "key",
                            event.target.value,
                        )
                    }
                    placeholder="crm.leads.create"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="text-xs text-muted-foreground">

                    Use a stable identifier such as
                    <span className="font-medium">
                        {" "}crm.leads.create
                    </span>.

                </p>

            </div>


            <div className="space-y-2">

                <label
                    htmlFor="permission-name"
                    className="text-sm font-medium"
                >

                    Permission Name

                </label>

                <input
                    id="permission-name"
                    name="name"
                    type="text"
                    value={form.name}
                    disabled={loading}
                    onChange={event =>
                        updateField(
                            "name",
                            event.target.value,
                        )
                    }
                    placeholder="Create Leads"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                />

            </div>


            <div className="grid gap-4 md:grid-cols-2">

                <div className="space-y-2">

                    <label
                        htmlFor="permission-module"
                        className="text-sm font-medium"
                    >

                        Module

                    </label>

                    <input
                        id="permission-module"
                        name="module"
                        type="text"
                        value={form.module}
                        disabled={loading}
                        onChange={event =>
                            updateField(
                                "module",
                                event.target.value,
                            )
                        }
                        placeholder="CRM"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                    />

                </div>


                <div className="space-y-2">

                    <label
                        htmlFor="permission-action"
                        className="text-sm font-medium"
                    >

                        Action

                    </label>

                    <input
                        id="permission-action"
                        name="action"
                        type="text"
                        value={form.action}
                        disabled={loading}
                        onChange={event =>
                            updateField(
                                "action",
                                event.target.value,
                            )
                        }
                        placeholder="Create"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                    />

                </div>

            </div>


            <div className="space-y-2">

                <label
                    htmlFor="permission-description"
                    className="text-sm font-medium"
                >

                    Description

                </label>

                <textarea
                    id="permission-description"
                    name="description"
                    rows={4}
                    value={form.description}
                    disabled={loading}
                    onChange={event =>
                        updateField(
                            "description",
                            event.target.value,
                        )
                    }
                    placeholder="Allows users to create CRM leads."
                    className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                />

            </div>


            <div className="space-y-2">

                <label
                    htmlFor="permission-type"
                    className="text-sm font-medium"
                >

                    Permission Type

                </label>

                <select
                    id="permission-type"
                    name="type"
                    value={form.type}
                    disabled={
                        loading ||
                        isSystemPermission
                    }
                    onChange={event =>
                        updateField(
                            "type",
                            event.target.value as PermissionType,
                        )
                    }
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                >

                    <option value="Custom">
                        Custom
                    </option>

                    <option value="System">
                        System
                    </option>

                </select>

                {isSystemPermission && (

                    <p className="text-xs text-muted-foreground">

                        System permission type cannot be changed.

                    </p>

                )}

            </div>


            <div className="flex items-center justify-end gap-3 border-t pt-5">

                {onClose && (

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        Cancel

                    </button>

                )}


                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >

                    {
                        loading
                            ? "Saving..."
                            : isEditing
                                ? "Save Changes"
                                : "Create Permission"
                    }

                </button>

            </div>

        </form>

    );

}