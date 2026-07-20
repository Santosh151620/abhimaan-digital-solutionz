'use client';

import {
    useState,
} from 'react';

import {
    createTask,
    deleteTask,
    updateTaskStatus,
} from './actions';

import type {
    Task,
    TaskStatus,
} from '@/types/crm/Tasks';


interface Props {
    initialTasks: Task[];
}


export default function TasksClient({
    initialTasks,
}: Props) {

    const [
        tasks,
        setTasks,
    ] = useState<Task[]>(
        initialTasks
    );


    const [
        title,
        setTitle,
    ] = useState('');


    async function handleCreate() {

        if (!title.trim()) {
            return;
        }


        const task =
            await createTask({
                title,
                status: 'Todo',
                priority: 'Medium',
            });


        setTasks(
            previous => [
                ...previous,
                task,
            ]
        );


        setTitle('');

    }



    async function handleStatus(
        id: string,
        status: TaskStatus,
    ) {

        const updated =
            await updateTaskStatus(
                id,
                status
            );


        if (!updated) {
            return;
        }


        setTasks(
            previous =>
                previous.map(
                    task =>
                        task.id === id
                            ? updated
                            : task
                )
        );

    }



    async function handleDelete(
        id: string
    ) {

        const success =
            await deleteTask(id);


        if (!success) {
            return;
        }


        setTasks(
            previous =>
                previous.filter(
                    task =>
                        task.id !== id
                )
        );

    }



    return (

        <div className="space-y-6">


            <div className="flex gap-3">

                <input
                    value={title}
                    onChange={
                        e =>
                            setTitle(
                                e.target.value
                            )
                    }
                    placeholder="New task title"
                    className="border rounded px-3 py-2 flex-1"
                />


                <button
                    onClick={handleCreate}
                    className="rounded bg-primary px-4 py-2 text-primary-foreground"
                >
                    Add Task
                </button>


            </div>



            <div className="rounded-lg border">

                {
                    tasks.map(
                        task => (

                            <div
                                key={task.id}
                                className="flex items-center justify-between border-b p-4 last:border-0"
                            >

                                <div>

                                    <p className="font-medium">
                                        {task.title}
                                    </p>


                                    <p className="text-sm text-muted-foreground">
                                        {task.status}
                                        {' • '}
                                        {task.priority}
                                    </p>

                                </div>



                                <div className="flex gap-2">


                                    <select
                                        value={task.status}
                                        onChange={
                                            e =>
                                                handleStatus(
                                                    task.id,
                                                    e.target.value as TaskStatus
                                                )
                                        }
                                        className="border rounded px-2 py-1"
                                    >

                                        <option value="Todo">
                                            Todo
                                        </option>

                                        <option value="In Progress">
                                            In Progress
                                        </option>

                                        <option value="Blocked">
                                            Blocked
                                        </option>

                                        <option value="Completed">
                                            Completed
                                        </option>

                                        <option value="Cancelled">
                                            Cancelled
                                        </option>

                                    </select>



                                    <button
                                        onClick={
                                            () =>
                                                handleDelete(
                                                    task.id
                                                )
                                        }
                                        className="text-sm text-destructive"
                                    >
                                        Delete
                                    </button>


                                </div>


                            </div>

                        )
                    )
                }


                {
                    tasks.length === 0 && (

                        <div className="p-6 text-center text-muted-foreground">
                            No tasks available.
                        </div>

                    )
                }


            </div>


        </div>

    );

}