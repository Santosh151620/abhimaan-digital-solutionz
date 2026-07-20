import {
    searchTasks,
    getTasksSummary,
} from './actions';

import TasksClient from './TasksClient';

import type {
    Task,
    TaskStatus,
} from '@/types/crm/Tasks';



interface Props {

    searchParams?: Promise<{

        status?: string;

        priority?: string;

        search?: string;

    }>;

}



export default async function TasksPage(
    props: Props
) {


    const searchParams =
        await props.searchParams;



    const tasks =
        await searchTasks({

            status:
                searchParams?.status as TaskStatus,


            priority:
                searchParams?.priority as Task['priority'],


            search:
                searchParams?.search,

        });



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



            <div className="rounded-lg border p-6">


                <div className="mb-4">

                    <h2 className="font-semibold">
                        Task Management
                    </h2>


                    <p className="text-sm text-muted-foreground">
                        Search and filter supported through URL parameters.
                    </p>


                </div>



                <TasksClient

                    initialTasks={tasks}

                />


            </div>


        </div>

    );

}