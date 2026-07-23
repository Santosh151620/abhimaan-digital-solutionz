'use client';

import {
    useState,
} from 'react';


import type {
    Activity,
    ActivityPriority,
    ActivityStatus,
    ActivityType,
} from '@/types/crm/Activity';



interface Props {

    initialValues?: Partial<Activity>;

    loading?: boolean;

    onSubmit?: (
        values: Partial<Activity>
    ) => void | Promise<void>;

    onCancel?: () => void;

}



const types: ActivityType[] = [

    'Call',
    'Meeting',
    'Email',
    'Task',
    'Follow-up',
    'Note',
    'Demo',
    'Visit',
    'Other',

];



const statuses: ActivityStatus[] = [

    'Planned',
    'In Progress',
    'Completed',
    'Cancelled',
    'Missed',

];



const priorities: ActivityPriority[] = [

    'Low',
    'Medium',
    'High',
    'Critical',

];



export default function ActivityForm({

    initialValues,

    loading = false,

    onSubmit,

    onCancel,

}: Props) {



    const [form, setForm] =
        useState<Partial<Activity>>({

            type: 'Meeting',

            status: 'Planned',

            priority: 'Medium',

            ...initialValues,

        });



    function update<K extends keyof Activity>(

        key: K,

        value: Activity[K],

    ) {


        setForm(previous => ({

            ...previous,

            [key]: value,

        }));

    }




    async function submit(

        event: React.FormEvent<HTMLFormElement>,

    ) {


        event.preventDefault();



        if (!form.title?.trim()) {

            alert(
                'Activity title is required.',
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

            className="space-y-6 rounded-xl border bg-background p-6"

        >


            <div className="grid gap-4 md:grid-cols-2">



                <div>

                    <label className="mb-1 block text-sm font-medium">

                        Title

                    </label>


                    <input

                        className="w-full rounded-lg border p-2"

                        value={form.title ?? ''}

                        onChange={
                            event =>
                                update(
                                    'title',
                                    event.target.value,
                                )
                        }

                    />

                </div>




                <div>

                    <label className="mb-1 block text-sm font-medium">

                        Type

                    </label>


                    <select

                        className="w-full rounded-lg border p-2"

                        value={form.type}

                        onChange={
                            event =>
                                update(
                                    'type',
                                    event.target.value as ActivityType,
                                )
                        }

                    >

                        {
                            types.map(type => (

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

                        Status

                    </label>


                    <select

                        className="w-full rounded-lg border p-2"

                        value={form.status}

                        onChange={
                            event =>
                                update(
                                    'status',
                                    event.target.value as ActivityStatus,
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




                <div>

                    <label className="mb-1 block text-sm font-medium">

                        Priority

                    </label>


                    <select

                        className="w-full rounded-lg border p-2"

                        value={form.priority}

                        onChange={
                            event =>
                                update(
                                    'priority',
                                    event.target.value as ActivityPriority,
                                )
                        }

                    >

                        {
                            priorities.map(priority => (

                                <option
                                    key={priority}
                                    value={priority}
                                >

                                    {priority}

                                </option>

                            ))
                        }

                    </select>

                </div>




                <div>

                    <label className="mb-1 block text-sm font-medium">

                        Start Date

                    </label>


                    <input

                        type="datetime-local"

                        className="w-full rounded-lg border p-2"

                        value={form.startDate ?? ''}

                        onChange={
                            event =>
                                update(
                                    'startDate',
                                    event.target.value,
                                )
                        }

                    />

                </div>




                <div>

                    <label className="mb-1 block text-sm font-medium">

                        End Date

                    </label>


                    <input

                        type="datetime-local"

                        className="w-full rounded-lg border p-2"

                        value={form.endDate ?? ''}

                        onChange={
                            event =>
                                update(
                                    'endDate',
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

                    className="rounded-lg border px-4 py-2"

                >

                    Cancel

                </button>



                <button

                    type="submit"

                    disabled={loading}

                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"

                >

                    {
                        loading
                            ? 'Saving...'
                            : 'Save Activity'
                    }

                </button>



            </div>



        </form>

    );


}