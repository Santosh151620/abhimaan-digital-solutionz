'use client';

import {
    useState,
} from 'react';

import type {
    Setting,
    SettingCategory,
} from '@/types/crm/Settings';


interface Props {

    initialValues?: Partial<Setting>;

    loading?: boolean;

    onSubmit?: (
        values: Partial<Setting>,
    ) => void | Promise<void>;

    onCancel?: () => void;

}


const MAX_NAME_LENGTH =
    150;

const MAX_KEY_LENGTH =
    150;


/**
 * UI category catalogue.
 *
 * The persistence/domain layer remains the source of truth for
 * validation. The form deliberately does not introduce a second
 * SettingCategory contract.
 */
const categories = [
    'General',
    'CRM',
    'Notification',
    'Security',
    'Email',
    'Integration',
    'Company',
    'Appearance',
    'Other',
] as const;


/**
 * Convert a persisted SettingValue into a form-safe textarea value.
 */
function stringifyValue(
    value: Setting['value'] | undefined,
): string {

    if (
        value === undefined ||
        value === null
    ) {

        return '';

    }


    if (
        typeof value === 'string'
    ) {

        return value;

    }


    if (
        typeof value === 'number' ||
        typeof value === 'boolean'
    ) {

        return String(value);

    }


    try {

        return JSON.stringify(
            value,
            null,
            2,
        );

    } catch {

        return '';

    }

}


export default function SettingsForm({
    initialValues,
    loading = false,
    onSubmit,
    onCancel,
}: Props) {


    const [
        form,
        setForm,
    ] =
        useState<Partial<Setting>>({

            category:
                'General' as SettingCategory,

            isActive:
                true,

            isReadonly:
                false,

            isEncrypted:
                false,

            ...initialValues,

        });


    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        );


    function update<K extends keyof Setting>(
        key: K,
        value: Setting[K],
    ): void {

        setForm(
            previous => ({

                ...previous,

                [key]:
                    value,

            }),
        );

        setError(
            null,
        );

    }


    async function submit(
        event: React.FormEvent<HTMLFormElement>,
    ): Promise<void> {

        event.preventDefault();


        if (loading) {

            return;

        }


        const name =
            form.name?.trim() ??
            '';


        const key =
            form.key?.trim() ??
            '';


        if (!name) {

            setError(
                'Setting name is required.',
            );

            return;

        }


        if (
            name.length >
            MAX_NAME_LENGTH
        ) {

            setError(
                `Setting name cannot exceed ${MAX_NAME_LENGTH} characters.`,
            );

            return;

        }


        if (!key) {

            setError(
                'Setting key is required.',
            );

            return;

        }


        if (
            key.length >
            MAX_KEY_LENGTH
        ) {

            setError(
                `Setting key cannot exceed ${MAX_KEY_LENGTH} characters.`,
            );

            return;

        }


        if (
            !/^[a-zA-Z0-9._:-]+$/.test(
                key,
            )
        ) {

            setError(
                'Setting key may contain only letters, numbers, dots, underscores, colons and hyphens.',
            );

            return;

        }


        try {

            setError(
                null,
            );


            await onSubmit?.({

                ...form,

                name,

                key,

            });

        } catch (
            submitError
        ) {

            console.error(
                'Settings form submission failed:',
                submitError,
            );


            setError(
                submitError instanceof Error
                    ? submitError.message
                    : 'Unable to save the setting. Please try again.',
            );

        }

    }


    return (

        <form
            onSubmit={
                submit
            }
            noValidate
            className="
                space-y-6
                rounded-xl
                border
                bg-background
                p-6
            "
        >

            {
                error && (

                    <div
                        role="alert"
                        className="
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


            <div
                className="
                    grid
                    gap-4
                    md:grid-cols-2
                "
            >

                <div>

                    <label
                        htmlFor="setting-name"
                        className="
                            mb-1
                            block
                            text-sm
                            font-medium
                        "
                    >
                        Name
                    </label>


                    <input
                        id="setting-name"
                        name="name"
                        type="text"
                        required
                        maxLength={
                            MAX_NAME_LENGTH
                        }
                        autoComplete="off"
                        disabled={
                            loading
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            p-2
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                        value={
                            form.name ??
                            ''
                        }
                        onChange={
                            event =>
                                update(
                                    'name',
                                    event.target.value,
                                )
                        }
                    />

                </div>


                <div>

                    <label
                        htmlFor="setting-key"
                        className="
                            mb-1
                            block
                            text-sm
                            font-medium
                        "
                    >
                        Key
                    </label>


                    <input
                        id="setting-key"
                        name="key"
                        type="text"
                        required
                        maxLength={
                            MAX_KEY_LENGTH
                        }
                        autoComplete="off"
                        placeholder="example.setting"
                        disabled={
                            loading
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            p-2
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                        value={
                            form.key ??
                            ''
                        }
                        onChange={
                            event =>
                                update(
                                    'key',
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
                        "
                    >
                        Category
                    </label>


                    <select
                        id="setting-category"
                        name="category"
                        disabled={
                            loading
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            p-2
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                        value={
                            form.category ??
                            'General'
                        }
                        onChange={
                            event =>
                                update(
                                    'category',
                                    event.target.value as SettingCategory,
                                )
                        }
                    >

                        {
                            categories.map(
                                category => (

                                    <option
                                        key={
                                            category
                                        }
                                        value={
                                            category
                                        }
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
                        htmlFor="setting-active"
                        className="
                            mb-1
                            block
                            text-sm
                            font-medium
                        "
                    >
                        Status
                    </label>


                    <select
                        id="setting-active"
                        name="isActive"
                        disabled={
                            loading
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            p-2
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                        value={
                            form.isActive === false
                                ? 'Inactive'
                                : 'Active'
                        }
                        onChange={
                            event =>
                                update(
                                    'isActive',
                                    event.target.value ===
                                        'Active',
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


                <div
                    className="
                        md:col-span-2
                    "
                >

                    <label
                        htmlFor="setting-value"
                        className="
                            mb-1
                            block
                            text-sm
                            font-medium
                        "
                    >
                        Value
                    </label>


                    <textarea
                        id="setting-value"
                        name="value"
                        rows={5}
                        disabled={
                            loading
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            p-2
                            font-mono
                            text-sm
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                        value={
                            stringifyValue(
                                form.value,
                            )
                        }
                        onChange={
                            event =>
                                update(
                                    'value',
                                    event.target.value,
                                )
                        }
                    />

                </div>


                <div
                    className="
                        md:col-span-2
                    "
                >

                    <label
                        htmlFor="setting-description"
                        className="
                            mb-1
                            block
                            text-sm
                            font-medium
                        "
                    >
                        Description
                    </label>


                    <textarea
                        id="setting-description"
                        name="description"
                        rows={3}
                        disabled={
                            loading
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            p-2
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                        value={
                            form.description ??
                            ''
                        }
                        onChange={
                            event =>
                                update(
                                    'description',
                                    event.target.value,
                                )
                        }
                    />

                </div>


                <label
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    <input
                        type="checkbox"
                        name="isReadonly"
                        disabled={
                            loading
                        }
                        checked={
                            form.isReadonly ??
                            false
                        }
                        onChange={
                            event =>
                                update(
                                    'isReadonly',
                                    event.target.checked,
                                )
                        }
                    />

                    Read-only

                </label>


                <label
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    <input
                        type="checkbox"
                        name="isEncrypted"
                        disabled={
                            loading
                        }
                        checked={
                            form.isEncrypted ??
                            false
                        }
                        onChange={
                            event =>
                                update(
                                    'isEncrypted',
                                    event.target.checked,
                                )
                        }
                    />

                    Encrypted

                </label>

            </div>


            <div
                className="
                    flex
                    justify-end
                    gap-3
                "
            >

                {
                    onCancel && (

                        <button
                            type="button"
                            onClick={
                                onCancel
                            }
                            disabled={
                                loading
                            }
                            className="
                                rounded-lg
                                border
                                px-4
                                py-2
                                transition
                                hover:bg-muted
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            Cancel
                        </button>

                    )
                }


                <button
                    type="submit"
                    disabled={
                        loading
                    }
                    className="
                        rounded-lg
                        bg-primary
                        px-4
                        py-2
                        text-primary-foreground
                        transition
                        hover:opacity-90
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >
                    {
                        loading
                            ? 'Saving...'
                            : 'Save Setting'
                    }
                </button>

            </div>

        </form>

    );

}