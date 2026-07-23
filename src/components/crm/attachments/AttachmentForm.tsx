'use client';


import {
    useState,
} from 'react';



import type {
    Attachment,
    AttachmentEntityType,
} from '@/types/crm/Attachment';



interface Props {

    initialValues?: Partial<Attachment>;

    loading?: boolean;

    onSubmit?: (

        values: Partial<Attachment>

    ) => void | Promise<void>;

    onCancel?: () => void;

}



const entityTypes: AttachmentEntityType[] = [

    'Lead',
    'Company',
    'Contact',
    'Project',
    'Task',
    'Activity',
    'Ticket',
    'Invoice',
    'Quotation',
    'Contract',
    'Other',

];



export default function AttachmentForm({

    initialValues,

    loading = false,

    onSubmit,

    onCancel,

}: Props) {



    const [form, setForm] =

        useState<Partial<Attachment>>({

            entityType: 'Other',

            ...initialValues,

        });



    function update(

        key: keyof Attachment,

        value: string,

    ) {


        setForm(

            previous => ({

                ...previous,

                [key]: value,

            })

        );


    }




    async function submit(

        event: React.FormEvent<HTMLFormElement>,

    ) {


        event.preventDefault();



        if (!form.fileName?.trim()) {


            alert(

                'File name is required.',

            );


            return;


        }



        await onSubmit?.(

            form,

        );


    }



    return (

        <form

            onSubmit={submit}

            className="space-y-6 rounded-xl border p-6"

        >


            <div className="grid gap-4 md:grid-cols-2">



                <div>

                    <label className="mb-1 block text-sm font-medium">

                        File Name

                    </label>


                    <input

                        className="w-full rounded-lg border p-2"

                        value={form.fileName ?? ''}

                        onChange={

                            event =>

                                update(

                                    'fileName',

                                    event.target.value,

                                )

                        }

                    />

                </div>




                <div>

                    <label className="mb-1 block text-sm font-medium">

                        Entity Type

                    </label>


                    <select

                        className="w-full rounded-lg border p-2"

                        value={form.entityType}

                        onChange={

                            event =>

                                update(

                                    'entityType',

                                    event.target.value,

                                )

                        }

                    >

                        {

                            entityTypes.map(type => (

                                <option

                                    key={type}

                                    value={type}

                                >

                                    {type}

                                </option>

                            ))

                        }

                    </select>

                </div>




                <div>

                    <label className="mb-1 block text-sm font-medium">

                        Entity ID

                    </label>


                    <input

                        className="w-full rounded-lg border p-2"

                        value={form.entityId ?? ''}

                        onChange={

                            event =>

                                update(

                                    'entityId',

                                    event.target.value,

                                )

                        }

                    />

                </div>




                <div>

                    <label className="mb-1 block text-sm font-medium">

                        File URL

                    </label>


                    <input

                        className="w-full rounded-lg border p-2"

                        value={form.fileUrl ?? ''}

                        onChange={

                            event =>

                                update(

                                    'fileUrl',

                                    event.target.value,

                                )

                        }

                    />

                </div>




                <div className="md:col-span-2">


                    <label className="mb-1 block text-sm font-medium">

                        Description

                    </label>


                    <textarea

                        rows={4}

                        className="w-full rounded-lg border p-2"

                        value={form.description ?? ''}

                        onChange={

                            event =>

                                update(

                                    'description',

                                    event.target.value,

                                )

                        }

                    />


                </div>



            </div>




            <div className="flex justify-end gap-3">


                <button

                    type="button"

                    onClick={onCancel}

                    className="rounded border px-4 py-2"

                >

                    Cancel

                </button>




                <button

                    type="submit"

                    disabled={loading}

                    className="rounded bg-primary px-4 py-2 text-primary-foreground"

                >

                    {

                        loading

                            ? 'Saving...'

                            : 'Save Attachment'

                    }

                </button>


            </div>


        </form>

    );


}