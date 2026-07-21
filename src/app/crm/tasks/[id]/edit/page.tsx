import Link from 'next/link';

import TasksForm from '@/components/crm/tasks/TasksForm';

import {
    getTask,
} from '../../actions';

interface Props {

    params: Promise<{
        id: string;
    }>;

}

export default async function EditTaskPage({
    params,
}: Props) {

    const { id } = await params;

    const task =
        await getTask(id);

    if (!task) {

        return (

            <div className="rounded-lg border p-6">
                Task not found.
            </div>

        );

    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-semibold">
                        Edit Task
                    </h1>

                    <p className="text-muted-foreground">
                        {task.taskNumber}
                    </p>

                </div>

                <Link
                    href={`/crm/tasks/${id}`}
                    className="rounded-lg border px-4 py-2"
                >
                    Back
                </Link>

            </div>

            <TasksForm
                initialValues={task}
            />

        </div>

    );

}