"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import type {
    Role,
    RoleLevel,
    RoleStatus,
    RoleType,
} from "@/types/admin/Role";

import {
    createRole,
    updateRole,
} from "@/app/admin/(protected)/roles/actions";


interface RoleDialogProps {

    role?: Role;

    onClose: () => void;

}


interface RoleFormState {

    name: string;

    code: string;

    description: string;

    type: RoleType;

    level: RoleLevel;

    status: RoleStatus;

}


const DEFAULT_FORM: RoleFormState = {

    name: "",

    code: "",

    description: "",

    type: "Custom",

    level: "Organization",

    status: "Active",

};


const ROLE_TYPES: RoleType[] = [

    "System",

    "Organization",

    "Custom",

];


const ROLE_LEVELS: RoleLevel[] = [

    "Platform",

    "Application",

    "Organization",

    "Department",

    "Team",

];


const ROLE_STATUSES: RoleStatus[] = [

    "Active",

    "Inactive",

    "Suspended",

    "Archived",

];


function createForm(
    role?: Role,
): RoleFormState {

    if (!role) {

        return {
            ...DEFAULT_FORM,
        };

    }

    return {

        name:
            role.name ?? "",

        code:
            role.code ?? "",

        description:
            role.description ?? "",

        type:
            role.type ?? "Custom",

        level:
            role.level ?? "Organization",

        status:
            role.status ?? "Active",

    };

}


export default function RoleDialog({

    role,

    onClose,

}: RoleDialogProps) {

    const router =
        useRouter();


    const [
        form,
        setForm,
    ] =
        useState<RoleFormState>(
            () => createForm(role),
        );


    const [
        loading,
        setLoading,
    ] =
        useState(false);


    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        );


    const isEditing =
        Boolean(role);


    const isSystemRole =
        role?.isSystem === true;


    useEffect(() => {

        setForm(
            createForm(role),
        );

        setError(null);

    }, [role]);


    function updateField<K extends keyof RoleFormState>(

        key: K,

        value: RoleFormState[K],

    ) {

        setForm(
            previous => ({

                ...previous,

                [key]: value,

            }),
        );

    }


    function validate(): boolean {

        const name =
            form.name.trim();

        const code =
            form.code.trim();


        if (!name) {

            setError(
                "Role name is required.",
            );

            return false;

        }


        if (!code) {

            setError(
                "Role code is required.",
            );

            return false;

        }


        if (
            !/^[a-zA-Z0-9_-]+$/.test(
                code,
            )
        ) {

            setError(
                "Role code may contain only letters, numbers, underscores, and hyphens.",
            );

            return false;

        }


        if (!form.type) {

            setError(
                "Role type is required.",
            );

            return false;

        }


        if (!form.level) {

            setError(
                "Role level is required.",
            );

            return false;

        }


        if (!form.status) {

            setError(
                "Role status is required.",
            );

            return false;

        }


        return true;

    }


    async function submit() {

        setError(null);


        if (!validate()) {

            return;

        }


        try {

            setLoading(true);


            if (role) {

                await updateRole({

                    ...role,

                    name:
                        form.name.trim(),

                    code:
                        isSystemRole
                            ? role.code
                            : form.code
                                .trim()
                                .toLowerCase(),

                    description:
                        form.description.trim()
                        || undefined,

                    type:
                        isSystemRole
                            ? role.type
                            : form.type,

                    level:
                        form.level,

                    status:
                        form.status,

                    isActive:
                        form.status === "Active",

                });

            }

            else {

                await createRole({

                    name:
                        form.name.trim(),

                    code:
                        form.code
                            .trim()
                            .toLowerCase(),

                    description:
                        form.description.trim()
                        || undefined,

                    type:
                        form.type,

                    level:
                        form.level,

                    status:
                        form.status,

                    permissionIds:
                        [],

                    isSystem:
                        false,

                    isDefault:
                        false,

                    isActive:
                        form.status === "Active",

                    metadata:
                        {},

                });

            }


            router.refresh();

            onClose();

        }

        catch (caughtError) {

            setError(

                caughtError instanceof Error

                    ? caughtError.message

                    : "Unable to save role.",

            );

        }

        finally {

            setLoading(false);

        }

    }


    function handleBackdropClick(
        event: React.MouseEvent<HTMLDivElement>,
    ) {

        if (
            event.target === event.currentTarget
            && !loading
        ) {

            onClose();

        }

    }


    return (

        <div

            role="presentation"

            onMouseDown={
                handleBackdropClick
            }

            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-black/40
                p-4
            "

        >

            <div

                role="dialog"

                aria-modal="true"

                aria-labelledby="role-dialog-title"

                className="
                    w-full
                    max-w-xl
                    rounded-xl
                    border
                    border-border
                    bg-background
                    p-6
                    shadow-xl
                "

            >

                <div className="space-y-1">

                    <h2

                        id="role-dialog-title"

                        className="
                            text-xl
                            font-semibold
                            text-foreground
                        "

                    >

                        {
                            isEditing
                                ? "Edit Role"
                                : "Create Role"
                        }

                    </h2>


                    <p className="
                        text-sm
                        text-muted-foreground
                    ">

                        {
                            isEditing
                                ? "Update the role configuration."
                                : "Create a role for the organization."
                        }

                    </p>

                </div>


                {
                    error && (

                        <div

                            role="alert"

                            className="
                                mt-5
                                rounded-lg
                                border
                                border-destructive/30
                                bg-destructive/10
                                p-3
                                text-sm
                                text-destructive
                            "

                        >

                            {error}

                        </div>

                    )
                }


                <div className="
                    mt-5
                    space-y-4
                ">


                    <div>

                        <label

                            htmlFor="role-name"

                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                            "

                        >

                            Role Name

                        </label>


                        <input

                            id="role-name"

                            type="text"

                            autoComplete="off"

                            value={form.name}

                            disabled={loading}

                            onChange={
                                event =>
                                    updateField(
                                        "name",
                                        event.target.value,
                                    )
                            }

                            className="
                                w-full
                                rounded-lg
                                border
                                border-border
                                bg-background
                                px-3
                                py-2
                                text-sm
                                outline-none
                                focus:border-primary
                                focus:ring-2
                                focus:ring-primary/20
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "

                            placeholder="Organization Administrator"

                        />

                    </div>


                    <div>

                        <label

                            htmlFor="role-code"

                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                            "

                        >

                            Role Code

                        </label>


                        <input

                            id="role-code"

                            type="text"

                            autoComplete="off"

                            value={form.code}

                            disabled={
                                loading
                                || isSystemRole
                            }

                            onChange={
                                event =>
                                    updateField(
                                        "code",
                                        event.target.value,
                                    )
                            }

                            className="
                                w-full
                                rounded-lg
                                border
                                border-border
                                bg-background
                                px-3
                                py-2
                                text-sm
                                font-mono
                                outline-none
                                focus:border-primary
                                focus:ring-2
                                focus:ring-primary/20
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "

                            placeholder="organization_admin"

                        />


                        {
                            isSystemRole && (

                                <p className="
                                    mt-1.5
                                    text-xs
                                    text-muted-foreground
                                ">

                                    System role codes cannot be changed.

                                </p>

                            )
                        }

                    </div>


                    <div>

                        <label

                            htmlFor="role-description"

                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                            "

                        >

                            Description

                        </label>


                        <textarea

                            id="role-description"

                            rows={3}

                            value={form.description}

                            disabled={loading}

                            onChange={
                                event =>
                                    updateField(
                                        "description",
                                        event.target.value,
                                    )
                            }

                            className="
                                w-full
                                resize-y
                                rounded-lg
                                border
                                border-border
                                bg-background
                                px-3
                                py-2
                                text-sm
                                outline-none
                                focus:border-primary
                                focus:ring-2
                                focus:ring-primary/20
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "

                            placeholder="Describe the purpose of this role."

                        />

                    </div>


                    <div className="
                        grid
                        gap-4
                        sm:grid-cols-2
                    ">


                        <div>

                            <label

                                htmlFor="role-type"

                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                "

                            >

                                Role Type

                            </label>


                            <select

                                id="role-type"

                                value={form.type}

                                disabled={
                                    loading
                                    || isSystemRole
                                }

                                onChange={
                                    event =>
                                        updateField(
                                            "type",
                                            event.target.value as RoleType,
                                        )
                                }

                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-border
                                    bg-background
                                    px-3
                                    py-2
                                    text-sm
                                    outline-none
                                    focus:border-primary
                                    focus:ring-2
                                    focus:ring-primary/20
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "

                            >

                                {
                                    ROLE_TYPES.map(
                                        type => (

                                            <option
                                                key={type}
                                                value={type}
                                            >

                                                {type}

                                            </option>

                                        ),
                                    )
                                }

                            </select>

                        </div>


                        <div>

                            <label

                                htmlFor="role-level"

                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                "

                            >

                                Role Level

                            </label>


                            <select

                                id="role-level"

                                value={form.level}

                                disabled={loading}

                                onChange={
                                    event =>
                                        updateField(
                                            "level",
                                            event.target.value as RoleLevel,
                                        )
                                }

                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-border
                                    bg-background
                                    px-3
                                    py-2
                                    text-sm
                                    outline-none
                                    focus:border-primary
                                    focus:ring-2
                                    focus:ring-primary/20
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "

                            >

                                {
                                    ROLE_LEVELS.map(
                                        level => (

                                            <option
                                                key={level}
                                                value={level}
                                            >

                                                {level}

                                            </option>

                                        ),
                                    )
                                }

                            </select>

                        </div>

                    </div>


                    <div>

                        <label

                            htmlFor="role-status"

                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                            "

                        >

                            Status

                        </label>


                        <select

                            id="role-status"

                            value={form.status}

                            disabled={loading}

                            onChange={
                                event =>
                                    updateField(
                                        "status",
                                        event.target.value as RoleStatus,
                                    )
                            }

                            className="
                                w-full
                                rounded-lg
                                border
                                border-border
                                bg-background
                                px-3
                                py-2
                                text-sm
                                outline-none
                                focus:border-primary
                                focus:ring-2
                                focus:ring-primary/20
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "

                        >

                            {
                                ROLE_STATUSES.map(
                                    status => (

                                        <option
                                            key={status}
                                            value={status}
                                        >

                                            {status}

                                        </option>

                                    ),
                                )
                            }

                        </select>

                    </div>

                </div>


                <div className="
                    mt-6
                    flex
                    justify-end
                    gap-3
                    border-t
                    border-border
                    pt-5
                ">


                    <button

                        type="button"

                        onClick={onClose}

                        disabled={loading}

                        className="
                            rounded-lg
                            border
                            border-border
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-foreground
                            transition
                            hover:bg-muted
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "

                    >

                        Cancel

                    </button>


                    <button

                        type="button"

                        onClick={submit}

                        disabled={loading}

                        className="
                            rounded-lg
                            bg-primary
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-primary-foreground
                            transition
                            hover:opacity-90
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "

                    >

                        {
                            loading
                                ? "Saving..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Create Role"
                        }

                    </button>

                </div>

            </div>

        </div>

    );

}