'use client';

import Link from 'next/link';

import type {
    Task,
} from '@/types/crm/Tasks';

interface Props {
    tasks: Task[];
}

export default function TasksTable({
    tasks,
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
                            Company
                        </th>

                        <th className="p-3">
                            Project
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

                        <th className="p-3">
                            Due Date
                        </th>

                        <th className="p-3 text-right">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {tasks.map(task => (

                        <tr
                            key={task.id}
                            className="border-b hover:bg-muted/30"
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
                                {task.companyId ?? '—'}
                            </td>

                            <td className="p-3">
                                {task.projectId ?? '—'}
                            </td>

                            <td className="p-3">
                                {task.assignedTo ?? '—'}
                            </td>

                            <td className="p-3">
                                {task.priority}
                            </td>

                            <td className="p-3">
                                {task.status}
                            </td>

                            <td className="p-3">
                                {task.dueDate ?? '—'}
                            </td>

                            <td className="p-3">

                                <div className="flex justify-end gap-2">

                                    <Link
                                        href={`/crm/tasks/${task.id}`}
                                        className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/crm/tasks/${task.id}/edit`}
                                        className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
                                    >
                                        Edit
                                    </Link>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}