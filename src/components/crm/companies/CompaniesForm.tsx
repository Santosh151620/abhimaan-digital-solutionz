'use client';

import { useState } from 'react';

import type {
    Company,
} from '@/types/crm/Companies';


interface CompaniesFormProps {

    initialValues?: Partial<Company>;

    onSubmit?: (
        values: Partial<Company>,
    ) => void | Promise<void>;

    onCancel?: () => void;

    loading?: boolean;

}


export function CompaniesForm({

    initialValues,

    onSubmit,

    onCancel,

    loading = false,

}: CompaniesFormProps) {


    const [form, setForm] =
        useState<Partial<Company>>({

            status: 'ACTIVE',

            ...initialValues,

        });


    function update<K extends keyof Company>(

        key: K,

        value: Company[K],

    ) {

        setForm(
            previous => ({

                ...previous,

                [key]: value,

            }),
        );

    }


    async function submit(
        event: React.FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault();


        if (loading) {

            return;

        }


        if (!form.name?.trim()) {

            alert(
                'Company name is required.',
            );

            return;

        }


        await onSubmit?.({

            ...form,

            name: form.name.trim(),

        });

    }


    const inputClass = `
        w-full
        rounded-xl
        border
        border-border
        bg-background
        px-3
        py-2.5
        text-sm
        text-foreground
        outline-none
        placeholder:text-muted-foreground
        transition
        focus:border-primary/50
        focus:ring-1
        focus:ring-primary/30
        disabled:cursor-not-allowed
        disabled:opacity-60
    `;


    const labelClass = `
        mb-1.5
        block
        text-sm
        font-medium
        text-foreground
    `;


    return (

        <form

            onSubmit={submit}

            className="
                space-y-6
                rounded-2xl
                border
                border-border
                bg-background
                p-6
                shadow-sm
            "

        >


            <div>

                <h2
                    className="
                        text-xl
                        font-semibold
                        text-foreground
                    "
                >
                    Company Details
                </h2>


                <p
                    className="
                        mt-1
                        text-sm
                        text-muted-foreground
                    "
                >
                    Create or update CRM company information.
                </p>


            </div>



            <div className="grid gap-5 md:grid-cols-2">



                <Field
                    label="Company Name *"
                    labelClass={labelClass}
                >

                    <input

                        className={inputClass}

                        value={
                            form.name ?? ''
                        }

                        disabled={loading}

                        autoComplete="organization"

                        onChange={
                            e =>
                                update(
                                    'name',
                                    e.target.value,
                                )
                        }

                    />

                </Field>



                <Field
                    label="Legal Name"
                    labelClass={labelClass}
                >

                    <input

                        className={inputClass}

                        value={
                            form.legalName ?? ''
                        }

                        disabled={loading}

                        autoComplete="organization"

                        onChange={
                            e =>
                                update(
                                    'legalName',
                                    e.target.value,
                                )
                        }

                    />

                </Field>



                <Field
                    label="Industry"
                    labelClass={labelClass}
                >

                    <input

                        className={inputClass}

                        value={
                            form.industry ?? ''
                        }

                        disabled={loading}

                        onChange={
                            e =>
                                update(
                                    'industry',
                                    e.target.value,
                                )
                        }

                    />

                </Field>




                <Field
                    label="Status"
                    labelClass={labelClass}
                >

                    <select

                        className={inputClass}

                        value={
                            form.status ?? 'ACTIVE'
                        }

                        disabled={loading}

                        onChange={
                            e =>
                                update(
                                    'status',
                                    e.target.value as Company['status'],
                                )
                        }

                    >

                        <option value="ACTIVE">
                            ACTIVE
                        </option>

                        <option value="PROSPECT">
                            PROSPECT
                        </option>

                        <option value="INACTIVE">
                            INACTIVE
                        </option>

                        <option value="ARCHIVED">
                            ARCHIVED
                        </option>

                    </select>

                </Field>



                <Field
                    label="Website"
                    labelClass={labelClass}
                >

                    <input

                        type="url"

                        className={inputClass}

                        value={
                            form.website ?? ''
                        }

                        disabled={loading}

                        autoComplete="url"

                        onChange={
                            e =>
                                update(
                                    'website',
                                    e.target.value,
                                )
                        }

                    />

                </Field>



                <Field
                    label="Email"
                    labelClass={labelClass}
                >

                    <input

                        type="email"

                        className={inputClass}

                        value={
                            form.email ?? ''
                        }

                        disabled={loading}

                        autoComplete="email"

                        onChange={
                            e =>
                                update(
                                    'email',
                                    e.target.value,
                                )
                        }

                    />

                </Field>



                <Field
                    label="Phone"
                    labelClass={labelClass}
                >

                    <input

                        type="tel"

                        className={inputClass}

                        value={
                            form.phone ?? ''
                        }

                        disabled={loading}

                        autoComplete="tel"

                        onChange={
                            e =>
                                update(
                                    'phone',
                                    e.target.value,
                                )
                        }

                    />

                </Field>



                <Field
                    label="Employees"
                    labelClass={labelClass}
                >

                    <input

                        type="number"

                        min="0"

                        className={inputClass}

                        value={
                            form.employees ?? ''
                        }

                        disabled={loading}

                        onChange={
                            e => {

                                const value =
                                    e.target.value;

                                update(
                                    'employees',
                                    value === ''
                                        ? undefined
                                        : Number(value),
                                );

                            }
                        }

                    />

                </Field>



                <div className="md:col-span-2">

                    <Field
                        label="Address"
                        labelClass={labelClass}
                    >

                        <input

                            className={inputClass}

                            value={
                                form.address ?? ''
                            }

                            disabled={loading}

                            autoComplete="street-address"

                            onChange={
                                e =>
                                    update(
                                        'address',
                                        e.target.value,
                                    )
                            }

                        />

                    </Field>

                </div>


            </div>



            <div className="
                flex
                flex-col-reverse
                justify-end
                gap-3
                sm:flex-row
            ">


                {
                    onCancel && (

                        <button

                            type="button"

                            onClick={onCancel}

                            disabled={loading}

                            className="
                                rounded-xl
                                border
                                border-border
                                px-5
                                py-2
                                text-sm
                                font-medium
                                text-foreground
                                transition
                                hover:bg-muted
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "

                        >
                            Cancel

                        </button>

                    )
                }



                <button

                    type="submit"

                    disabled={loading}

                    className="
                        rounded-xl
                        bg-primary
                        px-5
                        py-2
                        text-sm
                        font-semibold
                        text-primary-foreground
                        transition
                        hover:opacity-90
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "

                >

                    {
                        loading
                            ? 'Saving...'
                            : 'Save Company'
                    }

                </button>


            </div>


        </form>

    );

}



function Field({

    label,

    labelClass,

    children,

}: {

    label: string;

    labelClass: string;

    children: React.ReactNode;

}) {

    return (

        <div>

            <label className={labelClass}>

                {label}

            </label>


            {children}

        </div>

    );

}