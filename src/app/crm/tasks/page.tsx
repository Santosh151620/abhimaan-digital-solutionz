import {
    getTasks,
    getTasksSummary,
} from './actions';

import TasksClient from './TasksClient';


export default async function TasksPage() {

    const tasks =
        await getTasks();

    const summary =
        await getTasksSummary();

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-semibold">
                        Tasks
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage CRM tasks, assignments and progress.
                    </p>
                </div>

            </div>
            <div className="grid gap-4 md:grid-cols-4">

                <div className="rounded-lg border p-4">

                    <p className="text-sm text-muted-foreground">
                        Total
                    </p>

                    <p className="text-2xl font-bold">
                        {summary.total}
                    </p>

                </div>


                <div className="rounded-lg border p-4">

                    <p className="text-sm text-muted-foreground">
                        Todo
                    </p>

                    <p className="text-2xl font-bold">
                        {summary.todo}
                    </p>

                </div>


                <div className="rounded-lg border p-4">

                    <p className="text-sm text-muted-foreground">
                        In Progress
                    </p>

                    <p className="text-2xl font-bold">
                        {summary.inProgress}
                    </p>

                </div>


                <div className="rounded-lg border p-4">

                    <p className="text-sm text-muted-foreground">
                        Completed
                    </p>

                    <p className="text-2xl font-bold">
                        {summary.completed}
                    </p>

                </div>

            </div>


            <div className="rounded-lg border">

                <div className="border-b px-6 py-4">

                    <h2 className="font-semibold">
                        Task List
                    </h2>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="border-b">

                            <tr>

                                <th className="px-6 py-3 text-left">
                                    Task Number
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Title
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Status
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Priority
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Due Date
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {
                                tasks.map(
                                    task => (

                                        <tr
                                            key={task.id}
                                            className="border-b last:border-0"
                                        >

                                            <td className="px-6 py-3">
                                                {task.taskNumber}
                                            </td>


                                            <td className="px-6 py-3 font-medium">
                                                {task.title}
                                            </td>


                                            <td className="px-6 py-3">
                                                {task.status}
                                            </td>


                                            <td className="px-6 py-3">
                                                {task.priority}
                                            </td>


                                            <td className="px-6 py-3">
                                                {task.dueDate ?? '-'}
                                            </td>


                                        </tr>

                                    )
                                )
                            }


                            {
                                tasks.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            No tasks found.
                                        </td>

                                    </tr>

                                )
                            }


                        </tbody>


                    </table>
                    <TasksClient
                        initialTasks={tasks}
                    />
                </div>


            </div>


        </div>

    );

}