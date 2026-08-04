"use client";

import {
       useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import type {
    AdminUser,
} from "@/types/admin/User";

import {
    createUser,
    updateUser,
} from "@/app/admin/(protected)/users/actions";

interface UserDialogProps {

    user?: AdminUser;

    onClose: () => void;

}

const defaultForm: Partial<AdminUser> = {

    fullName: "",

    email: "",

    userType: "Internal",

    status: "Pending",

};

export default function UserDialog({

    user,

    onClose,

}: UserDialogProps) {

    const router =
        useRouter();

    const [
        loading,
        setLoading,
    ] =
    useState(false);

    const [
        error,
        setError,
    ] =
    useState<string | null>(null);

    const [
        form,
        setForm,
    ] =
    useState<Partial<AdminUser>>(
        defaultForm,
    );

    function updateField<
        K extends keyof AdminUser
    >(
        key: K,
        value: AdminUser[K],
    ) {

        setForm(
            previous => ({

                ...previous,

                [key]: value,

            }),
        );

    }

    async function submit() {

        setError(
            null,
        );

        if (
            !form.fullName?.trim()
        ) {

            setError(
                "Full name is required.",
            );

            return;

        }

        if (
            !form.email?.trim()
        ) {

            setError(
                "Email is required.",
            );

            return;

        }

        try {

            setLoading(
                true,
            );

            if (user) {

                await updateUser({

                    ...user,

                    ...form,

                } as AdminUser);

            }
            else {

                await createUser(
                    form,
                );

            }

            router.refresh();

            onClose();

        }
        catch (err) {

            setError(

                err instanceof Error

                    ? err.message

                    : "Unable to save user.",

            );

        }
        finally {

            setLoading(
                false,
            );

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

            <div
                className="
                w-full
                max-w-lg
                rounded-xl
                bg-background
                p-6
                shadow-xl
                space-y-5
                "
            >

                <div>

                    <h2
                        className="
                        text-xl
                        font-semibold
                        "
                    >

                        {

                            user

                                ? "Edit User"

                                : "Create User"

                        }

                    </h2>

                    <p
                        className="
                        text-sm
                        text-muted-foreground
                        "
                    >

                        Create or update
                        user information.

                    </p>

                </div>

                {

                    error && (

                        <div
                            className="
                            rounded-md
                            border
                            border-destructive
                            p-3
                            text-sm
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

                    placeholder="Full Name"

                    value={
                        form.fullName ?? ""
                    }

                    onChange={
                        event =>
                            updateField(
                                "fullName",
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

                    placeholder="Email"

                    type="email"

                    value={
                        form.email ?? ""
                    }

                    onChange={
                        event =>
                            updateField(
                                "email",
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
                        form.userType ?? "Internal"
                    }

                    onChange={
                        event =>
                            updateField(
                                "userType",
                                event.target.value as AdminUser["userType"],
                            )
                    }

                >

                    <option value="Internal">
                        Internal
                    </option>

                    <option value="Customer">
                        Customer
                    </option>

                    <option value="Partner">
                        Partner
                    </option>

                </select>

                <select

                    className="
                    w-full
                    rounded-md
                    border
                    p-2
                    "

                    value={
                        form.status ?? "Pending"
                    }

                    onChange={
                        event =>
                            updateField(
                                "status",
                                event.target.value as AdminUser["status"],
                            )
                    }

                >

                    <option value="Pending">
                        Pending
                    </option>

                    <option value="Active">
                        Active
                    </option>

                    <option value="Inactive">
                        Inactive
                    </option>

                </select>

                <div
                    className="
                    flex
                    justify-end
                    gap-3
                    pt-2
                    "
                >

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

                        type="button"

                        onClick={submit}

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

            </div>

        </div>

    );

}