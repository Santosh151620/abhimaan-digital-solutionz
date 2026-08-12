'use client';

import {
    useState,
} from 'react';

import type {
    Setting,
    SettingCategory,
    SettingStatus,
} from '@/types/crm/Settings';


interface Props {

    initialValues?: Partial<Setting>;

    loading?: boolean;

    onSubmit?: (
        values: Partial<Setting>,
    ) => void | Promise<void>;

    onCancel?: () => void;

}


const MAX_NAME_LENGTH = 150;

const MAX_KEY_LENGTH = 150;


const categories: SettingCategory[] = [
    'General',
    'Company',
    'CRM',
    'Notifications',
    'Security',
    'Billing',
    'Email',
    'Integrations',
    'Appearance',
    'Other',
];


const statuses: SettingStatus[] = [
    'Active',
    'Inactive',
];


export default function SettingsForm({
    initialValues,
    loading = false,
    onSubmit,
    onCancel,
}: Props) {


    const [form, setForm] =
        useState<Partial<Setting>>({

            category:
                'General',

            status:
                'Active',

            editable:
                true,

            encrypted:
                false,

            ...initialValues,

        });


    const [error, setError] =
        useState<string | null>(
            null,
        );


    function update<K extends keyof Setting>(
        key: K,
        value: Setting[K],
    ) {

        setForm(previous => ({

            ...previous,

            [key]:
                value,

        }));

        setError(null);

    }


    async function submit(
        event: React.FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault();


        if (loading) {

            return;

        }


        const name =
            form.name?.trim() ?? '';


        const key =
            form.key?.trim() ?? '';


        if (!name) {

            setError(
                'Setting name is required.',
            );

            return;

        }


        if (name.length > MAX_NAME_LENGTH) {

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


        if (key.length > MAX_KEY_LENGTH) {

            setError(
                `Setting key cannot exceed ${MAX_KEY_LENGTH} characters.`,
            );

            return;

        }


        if (!/^[a-zA-Z0-9._-]+$/.test(key)) {

            setError(
                'Setting key may contain only letters, numbers, dots, underscores and hyphens.',
            );

            return;

        }


        try {

            setError(null);


            await onSubmit?.({

                ...form,

                name,

                key,

            });


        } catch (submitError) {

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
            onSubmit={submit}
            noValidate
            className="space-y-6 rounded-xl border bg-background p-6"
        >

            {
                error && (

                    <div
                        role="alert"
                        className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                    >
                        {error}
                    </div>

                )
            }


            <div className="grid gap-4 md:grid-cols-2">


                <div>

                    <label
                        htmlFor="setting-name"
                        className="mb-1 block text-sm font-medium"
                    >
                        Name
                    </label>


                    <input
                        id="setting-name"
                        name="name"
                        type="text"
                        required
                        maxLength={MAX_NAME_LENGTH}
                        autoComplete="off"
                        disabled={loading}
                        className="w-full rounded-lg border p-2 disabled:cursor-not-allowed disabled:opacity-60"
                        value={form.name ?? ''}
                        onChange={event =>
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
                        className="mb-1 block text-sm font-medium"
                    >
                        Key
                    </label>


                    <input
                        id="setting-key"
                        name="key"
                        type="text"
                        required
                        maxLength={MAX_KEY_LENGTH}
                        autoComplete="off"
                        placeholder="example.setting"
                        className="w-full rounded-lg border p-2 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={loading}
                        value={form.key ?? ''}
                        onChange={event =>
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
                        className="mb-1 block text-sm font-medium"
                    >
                        Category
                    </label>


                    <select
                        id="setting-category"
                        name="category"
                        disabled={loading}
                        className="w-full rounded-lg border p-2 disabled:cursor-not-allowed disabled:opacity-60"
                        value={
                            form.category ??
                            'General'
                        }
                        onChange={event =>
                            update(
                                'category',
                                event.target.value as SettingCategory,
                            )
                        }
                    >

                        {
                            categories.map(category => (

                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>

                            ))
                        }

                    </select>

                </div>


                <div>

                    <label
                        htmlFor="setting-status"
                        className="mb-1 block text-sm font-medium"
                    >
                        Status
                    </label>


                    <select
                        id="setting-status"
                        name="status"
                        disabled={loading}
                        className="w-full rounded-lg border p-2 disabled:cursor-not-allowed disabled:opacity-60"
                        value={
                            form.status ??
                            'Active'
                        }
                        onChange={event =>
                            update(
                                'status',
                                event.target.value as SettingStatus,
                            )
                        }
                    >

                        {
                            statuses.map(status => (

                                <option
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </option>

                            ))
                        }

                    </select>

                </div>


                <div className="md:col-span-2">

                    <label
                        htmlFor="setting-value"
                        className="mb-1 block text-sm font-medium"
                    >
                        Value
                    </label>


                    <textarea
                        id="setting-value"
                        name="value"
                        rows={5}
                        disabled={loading}
                        className="w-full rounded-lg border p-2 font-mono text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        value={form.value ?? ''}
                        onChange={event =>
                            update(
                                'value',
                                event.target.value,
                            )
                        }
                    />

                </div>


                <div className="md:col-span-2">

                    <label
                        htmlFor="setting-description"
                        className="mb-1 block text-sm font-medium"
                    >
                        Description
                    </label>


                    <textarea
                        id="setting-description"
                        name="description"
                        rows={3}
                        disabled={loading}
                        className="w-full rounded-lg border p-2 disabled:cursor-not-allowed disabled:opacity-60"
                        value={form.description ?? ''}
                        onChange={event =>
                            update(
                                'description',
                                event.target.value,
                            )
                        }
                    />

                </div>


                <label className="flex items-center gap-2">

                    <input
                        type="checkbox"
                        name="editable"
                        disabled={loading}
                        checked={
                            form.editable ??
                            true
                        }
                        onChange={event =>
                            update(
                                'editable',
                                event.target.checked,
                            )
                        }
                    />

                    Editable

                </label>


                <label className="flex items-center gap-2">

                    <input
                        type="checkbox"
                        name="encrypted"
                        disabled={loading}
                        checked={
                            form.encrypted ??
                            false
                        }
                        onChange={event =>
                            update(
                                'encrypted',
                                event.target.checked,
                            )
                        }
                    />

                    Encrypted

                </label>

            </div>


            <div className="flex justify-end gap-3">

                {
                    onCancel && (

                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="rounded-lg border px-4 py-2 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>

                    )
                }


                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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