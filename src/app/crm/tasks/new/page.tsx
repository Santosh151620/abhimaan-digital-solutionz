import Link from 'next/link';

import TasksForm from '@/components/crm/tasks/TasksForm';

export default function NewTaskPage() {

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-semibold">
                        New Task
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Create a new CRM task.
                    </p>

                </div>

                <Link
                    href="/crm/tasks"
                    className="rounded-lg border px-4 py-2"
                >
                    Back
                </Link>

            </div>

            <TasksForm />

        </div>

    );

}