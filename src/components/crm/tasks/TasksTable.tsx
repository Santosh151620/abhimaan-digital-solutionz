'use client';

import Link from 'next/link';

import type {
    Task,
    TaskStatus,
} from '@/types/crm/Tasks';


interface Props {

    tasks: Task[];

    onStatusChange?: (
        task: Task,
        status: TaskStatus,
    ) => void;

    onDelete?: (
        task: Task,
    ) => void;

    onRestore?: (
        task: Task,
    ) => void;

}


const statuses: TaskStatus[] = [
    'Todo',
    'In Progress',
    'Blocked',
    'Completed',
    'Cancelled',
];


export default function TasksTable({
    tasks,
    onStatusChange,
    onDelete,
    onRestore,
}: Props) {


    if (tasks.length === 0) {

        return (

            <div className="rounded-xl border p-8 text-center text-muted-foreground">

                No tasks found.

            </div>

        );

    }


    return (

        <div className="overflow-x-auto rounded-xl border">

            <table className="w-full">

                <thead>

                    <tr className="border-b bg-muted/40 text-left">

                        <th className="p-3">
                            Task
                        </th>

                        <th className="p-3">
                            Entity
                        </th>

                        <th className="p-3">
                            Assigned
                        </th>

                        <th className="p-3">
                            Priority
                        </th>

                        <th className="p-3">
                            Status
                        </th>

                        <th className="p-3 text-right">
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {tasks.map(
                        task => (

                            <tr
                                key={task.id}
                                className="border-b last:border-0 hover:bg-muted/30"
                            >

                                <td className="p-3">

                                    <div className="font-medium">
                                        {task.title}
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        {task.taskNumber}
                                    </div>

                                </td>


                                <td className="p-3">

                                    <div>
                                        {task.entityType || '—'}
                                    </div>

                                    <div className="max-w-[180px] truncate text-xs text-muted-foreground">
                                        {task.entityId || '—'}
                                    </div>

                                </td>


                                <td className="p-3">

                                    {task.assignedTo || '—'}

                                </td>


                                <td className="p-3">

                                    {task.priority}

                                </td>


                                <td className="p-3">

                                    {onStatusChange ? (

                                        <select
                                            value={task.status}
                                            onChange={
                                                event =>
                                                    onStatusChange(
                                                        task,
                                                        event.target.value as TaskStatus,
                                                    )
                                            }
                                            className="h-9 rounded-md border bg-background px-2 text-sm"
                                        >

                                            {statuses.map(
                                                status => (

                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {status}
                                                    </option>

                                                ),
                                            )}

                                        </select>

                                    ) : (

                                        task.status

                                    )}

                                </td>


                                <td className="p-3">

                                    <div className="flex justify-end gap-2">

                                        <Link
                                            href={`/crm/tasks/${task.id}`}
                                            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                                        >
                                            View
                                        </Link>


                                        <Link
                                            href={`/crm/tasks/${task.id}/edit`}
                                            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90"
                                        >
                                            Edit
                                        </Link>


                                        {!task.archived && onDelete && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(task)
                                                }
                                                className="rounded-md border px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                                            >
                                                Archive
                                            </button>

                                        )}


                                        {task.archived && onRestore && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onRestore(task)
                                                }
                                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                                            >
                                                Restore
                                            </button>

                                        )}

                                    </div>

                                </td>

                            </tr>

                        ),
                    )}

                </tbody>

            </table>

        </div>

    );

}