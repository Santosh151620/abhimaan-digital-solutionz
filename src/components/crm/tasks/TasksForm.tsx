'use client';

import { useState } from 'react';

import type {
    Task,
    TaskPriority,
    TaskStatus,
} from '@/types/crm/Tasks';

interface Props {
    initialValues?: Partial<Task>;
    loading?: boolean;
    onSubmit?: (
        values: Partial<Task>
    ) => void | Promise<void>;
    onCancel?: () => void;
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

export default function TasksForm({
    initialValues,
    loading = false,
    onSubmit,
    onCancel,
}: Props) {

    const [form, setForm] =
        useState<Partial<Task>>({
            status: 'Todo',
            priority: 'Medium',
            ...initialValues,
        });

    function update<
        K extends keyof Task
    >(
        key: K,
        value: Task[K],
    ) {

        setForm(previous => ({
            ...previous,
            [key]: value,
        }));

    }

    async function submit(
        e: React.FormEvent<HTMLFormElement>,
    ) {

        e.preventDefault();

        if (!form.title?.trim()) {
            alert('Task title is required.');
            return;
        }

        await onSubmit?.(form);

    }

    return (

        <form
            onSubmit={submit}
            className="space-y-6 rounded-xl border bg-background p-6"
        >

            <div className="grid gap-4 md:grid-cols-2">

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Task Title
                    </label>

                    <input
                        className="w-full rounded-lg border p-2"
                        value={form.title ?? ''}
                        onChange={e =>
                            update(
                                'title',
                                e.target.value,
                            )
                        }
                    />

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Task Number
                    </label>

                    <input
                        className="w-full rounded-lg border p-2"
                        value={form.taskNumber ?? ''}
                        onChange={e =>
                            update(
                                'taskNumber',
                                e.target.value,
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
                        onChange={e =>
                            update(
                                'description',
                                e.target.value,
                            )
                        }
                    />

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Company
                    </label>

                    <input
                        className="w-full rounded-lg border p-2"
                        value={form.companyId ?? ''}
                        onChange={e =>
                            update(
                                'companyId',
                                e.target.value,
                            )
                        }
                    />

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Project
                    </label>

                    <input
                        className="w-full rounded-lg border p-2"
                        value={form.projectId ?? ''}
                        onChange={e =>
                            update(
                                'projectId',
                                e.target.value,
                            )
                        }
                    />

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Assigned To
                    </label>

                    <input
                        className="w-full rounded-lg border p-2"
                        value={form.assignedTo ?? ''}
                        onChange={e =>
                            update(
                                'assignedTo',
                                e.target.value,
                            )
                        }
                    />

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Status
                    </label>

                    <select
                        className="w-full rounded-lg border p-2"
                        value={form.status}
                        onChange={e =>
                            update(
                                'status',
                                e.target.value as TaskStatus,
                            )
                        }
                    >

                        {statuses.map(status => (

                            <option
                                key={status}
                                value={status}
                            >
                                {status}
                            </option>

                        ))}

                    </select>

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Priority
                    </label>

                    <select
                        className="w-full rounded-lg border p-2"
                        value={form.priority}
                        onChange={e =>
                            update(
                                'priority',
                                e.target.value as TaskPriority,
                            )
                        }
                    >

                        {priorities.map(priority => (

                            <option
                                key={priority}
                                value={priority}
                            >
                                {priority}
                            </option>

                        ))}

                    </select>

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Start Date
                    </label>

                    <input
                        type="date"
                        className="w-full rounded-lg border p-2"
                        value={form.startDate ?? ''}
                        onChange={e =>
                            update(
                                'startDate',
                                e.target.value,
                            )
                        }
                    />

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Due Date
                    </label>

                    <input
                        type="date"
                        className="w-full rounded-lg border p-2"
                        value={form.dueDate ?? ''}
                        onChange={e =>
                            update(
                                'dueDate',
                                e.target.value,
                            )
                        }
                    />

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Estimated Hours
                    </label>

                    <input
                        type="number"
                        className="w-full rounded-lg border p-2"
                        value={form.estimatedHours ?? ''}
                        onChange={e =>
                            update(
                                'estimatedHours',
                                Number(e.target.value),
                            )
                        }
                    />

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Actual Hours
                    </label>

                    <input
                        type="number"
                        className="w-full rounded-lg border p-2"
                        value={form.actualHours ?? ''}
                        onChange={e =>
                            update(
                                'actualHours',
                                Number(e.target.value),
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
                    {loading ? 'Saving...' : 'Save Task'}
                </button>

            </div>

        </form>

    );

}