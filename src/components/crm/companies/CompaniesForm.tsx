'use client';

import {
    useState,
} from 'react';

import type {
    ReactNode,
} from 'react';

import type {
    Company,
    CreateCompanyInput,
} from '@/types/crm/Companies';


import {
    createCompany,
} from '@/app/crm/companies/actions';





interface CompaniesFormProps {

    initialValues?: Partial<Company>;

    onCancel?: () => void;

    loading?: boolean;

}






export function CompaniesForm({

    initialValues,

    onCancel,

    loading = false,

}: CompaniesFormProps) {


    const [
        error,
        setError,
    ] = useState<string | null>(null);



    const [
        form,
        setForm,
    ] = useState<Partial<Company>>({

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

        event: React.FormEvent<HTMLFormElement>

    ) {


        event.preventDefault();



        if (loading) {

            return;

        }



        if (!form.name?.trim()) {

            setError(
                'Company name is required.',
            );

            return;

        }



        try {


            setError(null);



            const payload:CreateCompanyInput = {


                name:
                    form.name.trim(),



                legalName:
                    form.legalName,



                industry:
                    form.industry,



                website:
                    form.website,



                phone:
                    form.phone,



                email:
                    form.email,



                status:
                    form.status
                    ??
                    'ACTIVE',



                address:
                    form.address,



                city:
                    form.city,



                state:
                    form.state,



                country:
                    form.country,



                postalCode:
                    form.postalCode,



                employees:
                    form.employees,



                annualRevenue:
                    form.annualRevenue,



                taxId:
                    form.taxId,



                description:
                    form.description,

            };



            await createCompany(
                payload,
            );



        }
        catch(error) {


            setError(

                error instanceof Error

                    ? error.message

                    : 'Unable to save company.',

            );


        }


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

                <h2 className="
                    text-xl
                    font-semibold
                    text-foreground
                ">

                    Company Details

                </h2>


                <p className="
                    mt-1
                    text-sm
                    text-muted-foreground
                ">

                    Create or update CRM company information.

                </p>

            </div>




            {
                error && (

                    <p
                        role="alert"
                        className="
                            rounded-lg
                            border
                            border-destructive/20
                            bg-destructive/10
                            p-3
                            text-sm
                            text-destructive
                        "
                    >

                        {error}

                    </p>

                )
            }




            <div className="grid gap-5 md:grid-cols-2">


                <InputField
                    label="Company Name *"
                    value={form.name}
                    onChange={
                        value =>
                            update(
                                'name',
                                value,
                            )
                    }
                    disabled={loading}
                    className={inputClass}
                    labelClass={labelClass}
                />


                <InputField
                    label="Legal Name"
                    value={form.legalName}
                    onChange={
                        value =>
                            update(
                                'legalName',
                                value,
                            )
                    }
                    disabled={loading}
                    className={inputClass}
                    labelClass={labelClass}
                />


                <InputField
                    label="Industry"
                    value={form.industry}
                    onChange={
                        value =>
                            update(
                                'industry',
                                value,
                            )
                    }
                    disabled={loading}
                    className={inputClass}
                    labelClass={labelClass}
                />


                <InputField
                    label="Website"
                    value={form.website}
                    onChange={
                        value =>
                            update(
                                'website',
                                value,
                            )
                    }
                    disabled={loading}
                    className={inputClass}
                    labelClass={labelClass}
                />


                <InputField
                    label="Email"
                    value={form.email}
                    onChange={
                        value =>
                            update(
                                'email',
                                value,
                            )
                    }
                    disabled={loading}
                    className={inputClass}
                    labelClass={labelClass}
                />


                <InputField
                    label="Phone"
                    value={form.phone}
                    onChange={
                        value =>
                            update(
                                'phone',
                                value,
                            )
                    }
                    disabled={loading}
                    className={inputClass}
                    labelClass={labelClass}
                />


                <InputField
                    label="Employees"
                    value={form.employees?.toString()}
                    onChange={
                        value =>
                            update(
                                'employees',
                                value
                                    ? Number(value)
                                    : undefined,
                            )
                    }
                    disabled={loading}
                    className={inputClass}
                    labelClass={labelClass}
                    type="number"
                />


                <InputField
                    label="Annual Revenue"
                    value={form.annualRevenue?.toString()}
                    onChange={
                        value =>
                            update(
                                'annualRevenue',
                                value
                                    ? Number(value)
                                    : undefined,
                            )
                    }
                    disabled={loading}
                    className={inputClass}
                    labelClass={labelClass}
                    type="number"
                />


                <div className="md:col-span-2">

                    <InputField
                        label="Address"
                        value={form.address}
                        onChange={
                            value =>
                                update(
                                    'address',
                                    value,
                                )
                        }
                        disabled={loading}
                        className={inputClass}
                        labelClass={labelClass}
                    />

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







function InputField({

    label,

    value,

    onChange,

    disabled,

    className,

    labelClass,

    type = 'text',

}: {

    label:string;

    value?:string;

    onChange:(value:string)=>void;

    disabled:boolean;

    className:string;

    labelClass:string;

    type?:string;

}) {


    return (

        <Field

            label={label}

            labelClass={labelClass}

        >

            <input

                type={type}

                value={value ?? ''}

                disabled={disabled}

                className={className}

                onChange={
                    event =>
                        onChange(
                            event.target.value,
                        )
                }

            />

        </Field>

    );

}






function Field({

    label,

    labelClass,

    children,

}: {

    label:string;

    labelClass:string;

    children:ReactNode;

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