'use client';

import {
    useState,
} from 'react';


import type {
    Activity,
    ActivityPriority,
    ActivityStatus,
    ActivityType,
} from '@/types/crm/Activities';



interface Props {

    initialValues?: Partial<Activity>;

    loading?: boolean;

    onSubmit?: (
        values: Partial<Activity>,
    ) => void | Promise<void>;

    onCancel?: () => void;

}



const types: ActivityType[] = [

    'Call',
    'Meeting',
    'Email',
    'Note',
    'Task',
    'Follow Up',
    'SMS',
    'WhatsApp',
    'LinkedIn',
    'Demo',
    'Visit',
    'Reminder',
    'Other',

];



const statuses: ActivityStatus[] = [

    'Planned',
    'Scheduled',
    'Pending',
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


    const [
        form,
        setForm,
    ] =
        useState<Partial<Activity>>({

            entityType:
                'Activity',

            status:
                'Planned',

            priority:
                'Medium',

            type:
                'Meeting',

            ...initialValues,

        });



    function update<K extends keyof Activity>(

        key: K,

        value: Activity[K],

    ) {

        setForm(
            previous => ({

                ...previous,

                [key]:
                    value,

            }),
        );

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


            <div>

                <h2 className="text-xl font-semibold">

                    Activity Details

                </h2>


                <p className="text-sm text-muted-foreground">

                    Create CRM activity, follow-up, meeting or task.

                </p>

            </div>



            <div className="grid gap-4 md:grid-cols-2">



                <input

                    className="rounded-lg border p-2"

                    placeholder="Activity Title"

                    value={
                        form.title ?? ''
                    }

                    onChange={
                        event =>
                            update(
                                'title',
                                event.target.value,
                            )
                    }

                />



                <select

                    className="rounded-lg border p-2"

                    value={
                        form.type
                    }

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




                <select

                    className="rounded-lg border p-2"

                    value={
                        form.status
                    }

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




                <select

                    className="rounded-lg border p-2"

                    value={
                        form.priority
                    }

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



                <input

                    className="rounded-lg border p-2"

                    placeholder="Entity Id"

                    value={
                        form.entityId ?? ''
                    }

                    onChange={
                        event =>
                            update(
                                'entityId',
                                event.target.value,
                            )
                    }

                />



                <input

                    className="rounded-lg border p-2"

                    placeholder="Owner Id"

                    value={
                        form.ownerId ?? ''
                    }

                    onChange={
                        event =>
                            update(
                                'ownerId',
                                event.target.value,
                            )
                    }

                />



                <input

                    className="rounded-lg border p-2"

                    placeholder="Assigned To"

                    value={
                        form.assignedTo ?? ''
                    }

                    onChange={
                        event =>
                            update(
                                'assignedTo',
                                event.target.value,
                            )
                    }

                />



                <input

                    type="datetime-local"

                    className="rounded-lg border p-2"

                    value={
                        form.startDate ?? ''
                    }

                    onChange={
                        event =>
                            update(
                                'startDate',
                                event.target.value,
                            )
                    }

                />



                <input

                    type="datetime-local"

                    className="rounded-lg border p-2"

                    placeholder="Due Date"

                    value={
                        form.dueDate ?? ''
                    }

                    onChange={
                        event =>
                            update(
                                'dueDate',
                                event.target.value,
                            )
                    }

                />



                <input

                    className="rounded-lg border p-2"

                    placeholder="Location"

                    value={
                        form.location ?? ''
                    }

                    onChange={
                        event =>
                            update(
                                'location',
                                event.target.value,
                            )
                    }

                />



                <input

                    type="number"

                    className="rounded-lg border p-2"

                    placeholder="Duration Minutes"

                    value={
                        form.durationMinutes ?? ''
                    }

                    onChange={
                        event =>
                            update(
                                'durationMinutes',
                                Number(event.target.value),
                            )
                    }

                />


            </div>




            <textarea

                rows={4}

                className="w-full rounded-lg border p-2"

                placeholder="Description"

                value={
                    form.description ?? ''
                }

                onChange={
                    event =>
                        update(
                            'description',
                            event.target.value,
                        )
                }

            />



            <textarea

                rows={3}

                className="w-full rounded-lg border p-2"

                placeholder="Notes"

                value={
                    form.notes ?? ''
                }

                onChange={
                    event =>
                        update(
                            'notes',
                            event.target.value,
                        )
                }

            />



            <div className="flex justify-end gap-3">


                {
                    onCancel && (

                        <button

                            type="button"

                            onClick={onCancel}

                            className="rounded-lg border px-4 py-2"

                        >

                            Cancel

                        </button>

                    )
                }



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
