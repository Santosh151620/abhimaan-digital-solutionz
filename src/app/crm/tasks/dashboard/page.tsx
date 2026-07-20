import {
    getTasks,
    getTasksSummary,
} from '../actions';



export default async function TasksDashboardPage() {


    const tasks =
        await getTasks();


    const summary =
        await getTasksSummary();



    const dueSoon =
        tasks.filter(
            task =>
                task.dueDate
        ).length;



    const completionRate =
        summary.total === 0
            ? 0
            :
            Math.round(
                (
                    summary.completed /
                    summary.total
                )
                *
                100
            );



    return (

        <div className="space-y-6">


            <div>

                <h1 className="text-2xl font-semibold">
                    Task Dashboard
                </h1>


                <p className="text-sm text-muted-foreground">
                    Task performance and workflow metrics.
                </p>


            </div>



            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">


                <MetricCard

                    title="Total"

                    value={summary.total}

                />


                <MetricCard

                    title="Todo"

                    value={summary.todo}

                />


                <MetricCard

                    title="Progress"

                    value={summary.inProgress}

                />


                <MetricCard

                    title="Blocked"

                    value={summary.blocked}

                />


                <MetricCard

                    title="Critical"

                    value={summary.critical}

                />


                <MetricCard

                    title="Completed"

                    value={summary.completed}

                />


            </div>




            <div className="grid gap-4 md:grid-cols-2">


                <div className="rounded-lg border p-6">


                    <h2 className="font-semibold">
                        Completion Rate
                    </h2>


                    <p className="mt-3 text-4xl font-bold">
                        {completionRate}%
                    </p>


                </div>



                <div className="rounded-lg border p-6">


                    <h2 className="font-semibold">
                        Due Date Tracking
                    </h2>


                    <p className="mt-3 text-4xl font-bold">
                        {dueSoon}
                    </p>


                    <p className="text-sm text-muted-foreground">
                        Tasks with due dates
                    </p>


                </div>


            </div>



        </div>

    );

}




function MetricCard({

    title,

    value,

}: {

    title:string;

    value:number;

}) {


    return (

        <div className="rounded-lg border p-4">


            <p className="text-sm text-muted-foreground">
                {title}
            </p>


            <p className="mt-2 text-2xl font-bold">
                {value}
            </p>


        </div>

    );

}