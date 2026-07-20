'use client';

import {
    useState,
} from 'react';

import {
    updateTaskDetails,
} from './actions';

import type {
    Task,
} from '@/types/crm/Tasks';



interface Props {

    task: Task;

}



export default function TaskEditForm({
    task,
}: Props) {


    const [
        title,
        setTitle,
    ] = useState(
        task.title
    );


    const [
        description,
        setDescription,
    ] = useState(
        task.description ?? ''
    );


    const [
        priority,
        setPriority,
    ] = useState(
        task.priority
    );


    const [
        dueDate,
        setDueDate,
    ] = useState(
        task.dueDate ?? ''
    );


    const [
        saved,
        setSaved,
    ] = useState(false);



    async function handleSave() {


        await updateTaskDetails(
            task.id,
            {
                title,
                description,
                priority,
                dueDate,
            }
        );


        setSaved(true);


        setTimeout(
            () =>
                setSaved(false),
            2000
        );

    }



    return (

        <div className="space-y-4 rounded-lg border p-6">


            <h2 className="font-semibold">
                Edit Task
            </h2>



            <input
                value={title}
                onChange={
                    e =>
                        setTitle(
                            e.target.value
                        )
                }
                className="w-full rounded border px-3 py-2"
                placeholder="Task title"
            />



            <textarea

                value={description}

                onChange={
                    e =>
                        setDescription(
                            e.target.value
                        )
                }

                className="w-full rounded border px-3 py-2"

                placeholder="Description"

                rows={4}

            />



            <select

                value={priority}

                onChange={
                    e =>
                        setPriority(
                            e.target.value as Task['priority']
                        )
                }

                className="rounded border px-3 py-2"

            >

                <option value="Low">
                    Low
                </option>

                <option value="Medium">
                    Medium
                </option>

                <option value="High">
                    High
                </option>

                <option value="Critical">
                    Critical
                </option>

            </select>



            <input

                type="date"

                value={dueDate}

                onChange={
                    e =>
                        setDueDate(
                            e.target.value
                        )
                }

                className="rounded border px-3 py-2"

            />



            <button

                onClick={handleSave}

                className="rounded bg-primary px-4 py-2 text-primary-foreground"

            >

                Save Changes

            </button>



            {
                saved && (

                    <p className="text-sm text-green-600">
                        Task updated successfully.
                    </p>

                )
            }



        </div>

    );

}