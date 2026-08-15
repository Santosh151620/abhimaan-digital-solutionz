"use client";

import {
    useCallback,
    useEffect,
    useState,
    type FormEvent,
    type KeyboardEvent,
} from "react";

import type {
    PlatformSetting,
    SettingCategory,
    SettingValueType,
} from "@/types/admin/Settings";


interface SettingDialogProps {

    initialData?: PlatformSetting;

    onSave?: (
        setting: PlatformSetting,
    ) => Promise<void> | void;

    onClose?: () => void;

    triggerLabel?: string;

}


interface SettingFormState {

    scope: PlatformSetting["scope"];

    category: SettingCategory;

    key: string;

    name: string;

    description: string;

    value: string;

    valueType: SettingValueType;

    isSystem: boolean;

    isReadonly: boolean;

    isEncrypted: boolean;

    isVisible: boolean;

    isActive: boolean;

}


const SETTING_CATEGORIES:
    SettingCategory[] = [

    "General",
    "Security",
    "Authentication",
    "Branding",
    "Localization",
    "Notification",
    "Email",
    "Storage",
    "AI",
    "Integration",
    "Workflow",
    "CRM",
    "Reporting",
    "Billing",
    "System",

];


const SETTING_VALUE_TYPES:
    SettingValueType[] = [

    "String",
    "Number",
    "Boolean",
    "Json",
    "Array",

];


function serializeValue(
    value: PlatformSetting["value"],
): string {

    if (
        typeof value === "string"
    ) {

        return value;

    }


    if (
        value === undefined
    ) {

        return "";

    }


    try {

        return JSON.stringify(
            value,
        );

    } catch {

        return "";

    }

}


function createFormState(
    initialData?: PlatformSetting,
): SettingFormState {

    return {

        scope:
            initialData?.scope ??
            "Organization",

        category:
            initialData?.category ??
            "General",

        key:
            initialData?.key ??
            "",

        name:
            initialData?.name ??
            "",

        description:
            initialData?.description ??
            "",

        value:
            serializeValue(
                initialData?.value ??
                "",
            ),

        valueType:
            initialData?.valueType ??
            "String",

        isSystem:
            initialData?.isSystem ??
            false,

        isReadonly:
            initialData?.isReadonly ??
            false,

        isEncrypted:
            initialData?.isEncrypted ??
            false,

        isVisible:
            initialData?.isVisible ??
            true,

        isActive:
            initialData?.isActive ??
            true,

    };

}


function parseValue(
    value: string,
    valueType: SettingValueType,
): PlatformSetting["value"] {

    if (
        valueType === "String"
    ) {

        return value;

    }


    if (
        valueType === "Number"
    ) {

        const parsed =
            Number(value);


        if (
            !Number.isFinite(parsed)
        ) {

            throw new Error(
                "Value must be a valid number.",
            );

        }


        return parsed;

    }


    if (
        valueType === "Boolean"
    ) {

        if (
            value === "true"
        ) {

            return true;

        }


        if (
            value === "false"
        ) {

            return false;

        }


        throw new Error(
            "Value must be true or false.",
        );

    }


    try {

        const parsed =
            JSON.parse(value);


        if (
            valueType === "Array" &&
            !Array.isArray(parsed)
        ) {

            throw new Error(
                "Value must be a JSON array.",
            );

        }


        if (
            valueType === "Json" &&
            (
                parsed === null ||
                typeof parsed !== "object"
            )
        ) {

            throw new Error(
                "Value must be a JSON object or array.",
            );

        }


        return parsed;

    } catch (error) {

        if (
            error instanceof Error &&
            (
                error.message ===
                    "Value must be a JSON array." ||
                error.message ===
                    "Value must be a JSON object or array."
            )
        ) {

            throw error;

        }


        throw new Error(
            "Value must contain valid JSON.",
        );

    }

}


export default function SettingDialog({

    initialData,

    onSave,

    onClose,

    triggerLabel = "New Setting",

}: SettingDialogProps) {


    const [
        open,
        setOpen,
    ] =
        useState(false);


    const [
        form,
        setForm,
    ] =
        useState<SettingFormState>(
            () =>
                createFormState(
                    initialData,
                ),
        );


    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        );


    const [
        saving,
        setSaving,
    ] =
        useState(false);


    /*
     * Keep close stable because it is consumed by
     * the Escape-key effect and multiple event handlers.
     */
    const close =
        useCallback(
            (): void => {

                if (
                    saving
                ) {

                    return;

                }


                setOpen(false);

                setError(null);

                onClose?.();

            },
            [
                saving,
                onClose,
            ],
        );


    useEffect(
        () => {

            setForm(
                createFormState(
                    initialData,
                ),
            );

            setError(null);

        },
        [
            initialData,
        ],
    );


    useEffect(
        () => {

            if (
                !open
            ) {

                return;

            }


            function handleKeyDown(
                event: globalThis.KeyboardEvent,
            ): void {

                if (
                    event.key === "Escape" &&
                    !saving
                ) {

                    close();

                }

            }


            window.addEventListener(
                "keydown",
                handleKeyDown,
            );


            return () => {

                window.removeEventListener(
                    "keydown",
                    handleKeyDown,
                );

            };

        },
        [
            open,
            saving,
            close,
        ],
    );


    function setField<
        K extends keyof SettingFormState
    >(
        field: K,
        value: SettingFormState[K],
    ): void {

        setForm(
            previous => ({

                ...previous,

                [field]:
                    value,

            }),
        );


        setError(null);

    }


    function openDialog(): void {

        setForm(
            createFormState(
                initialData,
            ),
        );

        setError(null);

        setOpen(true);

    }


    function validate(): string | null {

        const key =
            form.key.trim();


        const name =
            form.name.trim();


        if (
            !key
        ) {

            return "Setting key is required.";

        }


        if (
            !/^[a-zA-Z0-9._:-]+$/.test(
                key,
            )
        ) {

            return (
                "Setting key may contain only letters, " +
                "numbers, dots, underscores, colons, and hyphens."
            );

        }


        if (
            !name
        ) {

            return "Display name is required.";

        }


        if (
            form.isSystem &&
            !form.isReadonly
        ) {

            return (
                "System settings must be marked as readonly."
            );

        }


        return null;

    }


    async function submit(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {

        event.preventDefault();


        if (
            saving
        ) {

            return;

        }


        const validationError =
            validate();


        if (
            validationError
        ) {

            setError(
                validationError,
            );

            return;

        }


        let parsedValue:
            PlatformSetting["value"];


        try {

            parsedValue =
                parseValue(
                    form.value,
                    form.valueType,
                );

        } catch (valueError) {

            setError(
                valueError instanceof Error
                    ? valueError.message
                    : "Invalid setting value.",
            );

            return;

        }


        if (
            !onSave
        ) {

            setError(
                "Settings save handler is not configured.",
            );

            return;

        }


        const now =
            new Date().toISOString();


        const setting:
            PlatformSetting =
            {

                id:
                    initialData?.id ??
                    crypto.randomUUID(),

                organizationId:
                    initialData?.organizationId,

                entityType:
                    initialData?.entityType ??
                    "PlatformSetting",

                scope:
                    form.scope,

                category:
                    form.category,

                key:
                    form.key.trim(),

                name:
                    form.name.trim(),

                description:
                    form.description.trim() ||
                    undefined,

                value:
                    parsedValue,

                valueType:
                    form.valueType,

                isSystem:
                    form.isSystem,

                isReadonly:
                    form.isReadonly,

                isEncrypted:
                    form.isEncrypted,

                isVisible:
                    form.isVisible,

                isActive:
                    form.isActive,

                metadata:
                    initialData?.metadata ??
                    {},

                createdAt:
                    initialData?.createdAt ??
                    now,

                updatedAt:
                    now,

            };


        setSaving(true);

        setError(null);


        try {

            await onSave(
                setting,
            );

            setOpen(false);

            setError(null);

            onClose?.();

        } catch (saveError) {

            setError(
                saveError instanceof Error
                    ? saveError.message
                    : "Failed to save setting.",
            );

        } finally {

            setSaving(false);

        }

    }


    function handleBackdropKeyDown(
        event: KeyboardEvent<HTMLDivElement>,
    ): void {

        if (
            event.key === "Escape" &&
            !saving
        ) {

            close();

        }

    }


    if (
        !open
    ) {

        return (

            <button
                type="button"
                className="
                    rounded-md
                    bg-blue-600
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:ring-offset-2
                "
                onClick={openDialog}
            >

                {triggerLabel}

            </button>

        );

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
            role="presentation"
            onKeyDown={
                handleBackdropKeyDown
            }
            onMouseDown={
                event => {

                    if (
                        event.target ===
                        event.currentTarget &&
                        !saving
                    ) {

                        close();

                    }

                }
            }
        >

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="setting-dialog-title"
                className="
                    max-h-[90vh]
                    w-full
                    max-w-xl
                    overflow-y-auto
                    rounded-lg
                    bg-white
                    p-6
                    shadow-xl
                "
                onMouseDown={
                    event =>
                        event.stopPropagation()
                }
            >

                <div
                    className="
                        mb-6
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >

                    <div>

                        <h2
                            id="setting-dialog-title"
                            className="
                                text-xl
                                font-semibold
                                text-gray-900
                            "
                        >

                            {
                                initialData
                                    ? "Edit Setting"
                                    : "New Setting"
                            }

                        </h2>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-gray-500
                            "
                        >

                            Configure an organization-scoped
                            platform setting.

                        </p>

                    </div>


                    <button
                        type="button"
                        className="
                            rounded-md
                            px-2
                            py-1
                            text-gray-500
                            hover:bg-gray-100
                            hover:text-gray-700
                        "
                        disabled={saving}
                        aria-label="Close dialog"
                        onClick={close}
                    >

                        ×

                    </button>

                </div>


                <form
                    onSubmit={submit}
                    noValidate
                >

                    <div className="space-y-5">

                        <div>

                            <label
                                htmlFor="setting-key"
                                className="
                                    mb-1
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                "
                            >

                                Setting Key

                            </label>


                            <input
                                id="setting-key"
                                type="text"
                                autoFocus
                                autoComplete="off"
                                disabled={
                                    saving ||
                                    initialData?.isReadonly === true
                                }
                                className="
                                    w-full
                                    rounded-md
                                    border
                                    border-gray-300
                                    px-3
                                    py-2
                                    text-sm
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-1
                                    focus:ring-blue-500
                                    disabled:bg-gray-100
                                "
                                placeholder="example.setting"
                                value={form.key}
                                onChange={
                                    event =>
                                        setField(
                                            "key",
                                            event.target.value,
                                        )
                                }
                            />

                        </div>


                        <div>

                            <label
                                htmlFor="setting-name"
                                className="
                                    mb-1
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                "
                            >

                                Display Name

                            </label>


                            <input
                                id="setting-name"
                                type="text"
                                disabled={
                                    saving ||
                                    initialData?.isReadonly === true
                                }
                                className="
                                    w-full
                                    rounded-md
                                    border
                                    border-gray-300
                                    px-3
                                    py-2
                                    text-sm
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-1
                                    focus:ring-blue-500
                                    disabled:bg-gray-100
                                "
                                placeholder="Setting name"
                                value={form.name}
                                onChange={
                                    event =>
                                        setField(
                                            "name",
                                            event.target.value,
                                        )
                                }
                            />

                        </div>


                        <div>

                            <label
                                htmlFor="setting-category"
                                className="
                                    mb-1
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                "
                            >

                                Category

                            </label>


                            <select
                                id="setting-category"
                                disabled={
                                    saving ||
                                    initialData?.isReadonly === true
                                }
                                className="
                                    w-full
                                    rounded-md
                                    border
                                    border-gray-300
                                    px-3
                                    py-2
                                    text-sm
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-1
                                    focus:ring-blue-500
                                    disabled:bg-gray-100
                                "
                                value={form.category}
                                onChange={
                                    event =>
                                        setField(
                                            "category",
                                            event.target.value as SettingCategory,
                                        )
                                }
                            >

                                {
                                    SETTING_CATEGORIES.map(
                                        category => (

                                            <option
                                                key={category}
                                                value={category}
                                            >

                                                {category}

                                            </option>

                                        ),
                                    )
                                }

                            </select>

                        </div>


                        <div>

                            <label
                                htmlFor="setting-type"
                                className="
                                    mb-1
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                "
                            >

                                Value Type

                            </label>


                            <select
                                id="setting-type"
                                disabled={
                                    saving ||
                                    initialData?.isReadonly === true
                                }
                                className="
                                    w-full
                                    rounded-md
                                    border
                                    border-gray-300
                                    px-3
                                    py-2
                                    text-sm
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-1
                                    focus:ring-blue-500
                                    disabled:bg-gray-100
                                "
                                value={form.valueType}
                                onChange={
                                    event =>
                                        setField(
                                            "valueType",
                                            event.target.value as SettingValueType,
                                        )
                                }
                            >

                                {
                                    SETTING_VALUE_TYPES.map(
                                        valueType => (

                                            <option
                                                key={valueType}
                                                value={valueType}
                                            >

                                                {valueType}

                                            </option>

                                        ),
                                    )
                                }

                            </select>

                        </div>


                        <div>

                            <label
                                htmlFor="setting-value"
                                className="
                                    mb-1
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                "
                            >

                                Value

                            </label>


                            <textarea
                                id="setting-value"
                                disabled={
                                    saving ||
                                    initialData?.isReadonly === true
                                }
                                rows={5}
                                className="
                                    w-full
                                    rounded-md
                                    border
                                    border-gray-300
                                    px-3
                                    py-2
                                    font-mono
                                    text-sm
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-1
                                    focus:ring-blue-500
                                    disabled:bg-gray-100
                                "
                                placeholder={
                                    form.valueType === "Json" ||
                                    form.valueType === "Array"
                                        ? '{"key":"value"}'
                                        : "Setting value"
                                }
                                value={form.value}
                                onChange={
                                    event =>
                                        setField(
                                            "value",
                                            event.target.value,
                                        )
                                }
                            />

                        </div>


                        <div>

                            <label
                                htmlFor="setting-description"
                                className="
                                    mb-1
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                "
                            >

                                Description

                            </label>


                            <textarea
                                id="setting-description"
                                disabled={
                                    saving ||
                                    initialData?.isReadonly === true
                                }
                                rows={3}
                                className="
                                    w-full
                                    rounded-md
                                    border
                                    border-gray-300
                                    px-3
                                    py-2
                                    text-sm
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-1
                                    focus:ring-blue-500
                                    disabled:bg-gray-100
                                "
                                placeholder="Describe what this setting controls."
                                value={form.description}
                                onChange={
                                    event =>
                                        setField(
                                            "description",
                                            event.target.value,
                                        )
                                }
                            />

                        </div>


                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-3
                                sm:grid-cols-2
                            "
                        >

                            <label
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-gray-700
                                "
                            >

                                <input
                                    type="checkbox"
                                    disabled={
                                        saving ||
                                        initialData?.isReadonly === true
                                    }
                                    checked={
                                        form.isActive
                                    }
                                    onChange={
                                        event =>
                                            setField(
                                                "isActive",
                                                event.target.checked,
                                            )
                                    }
                                />

                                Active

                            </label>


                            <label
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-gray-700
                                "
                            >

                                <input
                                    type="checkbox"
                                    disabled={
                                        saving ||
                                        initialData?.isReadonly === true
                                    }
                                    checked={
                                        form.isVisible
                                    }
                                    onChange={
                                        event =>
                                            setField(
                                                "isVisible",
                                                event.target.checked,
                                            )
                                    }
                                />

                                Visible

                            </label>


                            <label
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-gray-700
                                "
                            >

                                <input
                                    type="checkbox"
                                    disabled={
                                        saving ||
                                        initialData?.isReadonly === true
                                    }
                                    checked={
                                        form.isEncrypted
                                    }
                                    onChange={
                                        event =>
                                            setField(
                                                "isEncrypted",
                                                event.target.checked,
                                            )
                                    }
                                />

                                Encrypted

                            </label>


                            <label
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-gray-700
                                "
                            >

                                <input
                                    type="checkbox"
                                    disabled={
                                        saving ||
                                        initialData?.isReadonly === true
                                    }
                                    checked={
                                        form.isReadonly
                                    }
                                    onChange={
                                        event =>
                                            setField(
                                                "isReadonly",
                                                event.target.checked,
                                            )
                                    }
                                />

                                Readonly

                            </label>


                            <label
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-gray-700
                                "
                            >

                                <input
                                    type="checkbox"
                                    disabled={
                                        saving ||
                                        initialData?.isReadonly === true
                                    }
                                    checked={
                                        form.isSystem
                                    }
                                    onChange={
                                        event =>
                                            setField(
                                                "isSystem",
                                                event.target.checked,
                                            )
                                    }
                                />

                                System setting

                            </label>

                        </div>


                        {
                            error && (

                                <div
                                    role="alert"
                                    className="
                                        rounded-md
                                        border
                                        border-red-200
                                        bg-red-50
                                        px-3
                                        py-2
                                        text-sm
                                        text-red-700
                                    "
                                >

                                    {error}

                                </div>

                            )
                        }

                    </div>


                    <div
                        className="
                            mt-6
                            flex
                            justify-end
                            gap-2
                            border-t
                            pt-4
                        "
                    >

                        <button
                            type="button"
                            disabled={saving}
                            className="
                                rounded-md
                                border
                                border-gray-300
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-gray-700
                                hover:bg-gray-50
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                            onClick={close}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            disabled={
                                saving ||
                                initialData?.isReadonly === true
                            }
                            className="
                                rounded-md
                                bg-blue-600
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-white
                                hover:bg-blue-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            {
                                saving
                                    ? "Saving..."
                                    : initialData
                                        ? "Save Changes"
                                        : "Create Setting"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}
