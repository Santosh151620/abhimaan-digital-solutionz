'use client';

import {
    useState,
    useTransition,
} from 'react';

import type {
    Task,
    TaskPriority,
    TaskStatus,
} from '@/types/crm/Tasks';

import TasksTable from '@/components/crm/tasks/TasksTable';

import {
    updateTaskStatus,
    deleteTask,
    restoreTask,
} from '@/app/crm/tasks/actions';


interface Props {

    initialTasks: Task[];

}


const statuses: TaskStatus[] = [
    'Todo',
    'In Progress',
    'Blocked',
    'Completed',
    'Cancelled',
];


const priorities: TaskPriority[] = [
    'Low',
    'Medium',
    'High',
    'Critical',
];


export default function TasksClient({
    initialTasks,
}: Props) {


    const [
        tasks,
        setTasks,
    ] =
        useState<Task[]>(
            initialTasks,
        );


    const [
        isPending,
        startTransition,
    ] =
        useTransition();


    const [
        search,
        setSearch,
    ] =
        useState('');


    const [
        status,
        setStatus,
    ] =
        useState<
            TaskStatus | ''
        >('');


    const [
        priority,
        setPriority,
    ] =
        useState<
            TaskPriority | ''
        >('');



    const filteredTasks =
        tasks.filter(
            task => {


                const keyword =
                    search
                        .trim()
                        .toLowerCase();


                const matchesSearch =
                    keyword.length === 0
                    ||
                    task.title
                        .toLowerCase()
                        .includes(
                            keyword,
                        )
                    ||
                    task.taskNumber
                        .toLowerCase()
                        .includes(
                            keyword,
                        )
                    ||
                    task.description
                        ?.toLowerCase()
                        .includes(
                            keyword,
                        );


                const matchesStatus =
                    !status
                    ||
                    task.status === status;


                const matchesPriority =
                    !priority
                    ||
                    task.priority === priority;


                return (
                    matchesSearch
                    &&
                    matchesStatus
                    &&
                    matchesPriority
                );

            },
        );



    function handleStatusChange(
        task: Task,
        nextStatus: TaskStatus,
    ) {


        startTransition(
            async () => {


                try {


                    const updated =
                        await updateTaskStatus(
                            task.id,
                            nextStatus,
                        );


                    setTasks(
                        current =>
                            current.map(
                                item =>
                                    item.id === task.id
                                        ? updated
                                        : item,
                            ),
                    );


                } catch (error) {


                    console.error(
                        'Failed to update task status:',
                        error,
                    );


                }

            },
        );

    }



    function handleDelete(
        task: Task,
    ) {


        startTransition(
            async () => {


                try {


                    await deleteTask(
                        task.id,
                    );


                    setTasks(
                        current =>
                            current.filter(
                                item =>
                                    item.id !== task.id,
                            ),
                    );


                } catch (error) {


                    console.error(
                        'Failed to delete task:',
                        error,
                    );


                }

            },
        );

    }



    function handleRestore(
        task: Task,
    ) {


        startTransition(
            async () => {


                try {


                    const restored =
                        await restoreTask(
                            task.id,
                        );


                    if (restored) {

                        setTasks(
                            current =>
                                current.map(
                                    item =>
                                        item.id === task.id
                                            ? {
                                                ...item,
                                                archived: false,
                                            }
                                            : item,
                                ),
                        );

                    }


                } catch (error) {


                    console.error(
                        'Failed to restore task:',
                        error,
                    );


                }

            },
        );

    }



    return (

        <div className="space-y-4">


            <div className="flex flex-col gap-3 md:flex-row">


                <input
                    value={search}
                    onChange={
                        event =>
                            setSearch(
                                event.target.value,
                            )
                    }
                    placeholder="Search tasks..."
                    className="h-10 flex-1 rounded-md border bg-background px-3 text-sm"
                />


                <select
                    value={status}
                    onChange={
                        event =>
                            setStatus(
                                event.target.value as TaskStatus | '',
                            )
                    }
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                >

                    <option value="">
                        All statuses
                    </option>

                    {statuses.map(
                        item => (

                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>

                        ),
                    )}

                </select>


                <select
                    value={priority}
                    onChange={
                        event =>
                            setPriority(
                                event.target.value as TaskPriority | '',
                            )
                    }
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                >

                    <option value="">
                        All priorities
                    </option>

                    {priorities.map(
                        item => (

                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>

                        ),
                    )}

                </select>


            </div>



            <div className="text-sm text-muted-foreground">

                Showing {filteredTasks.length} of {tasks.length} tasks

                {isPending && (
                    <span className="ml-2">
                        Updating...
                    </span>
                )}

            </div>

<TasksTable
    tasks={filteredTasks}
    onStatusChange={handleStatusChange}
    onDelete={handleDelete}
    onRestore={handleRestore}
/>

        </div>

    );

}