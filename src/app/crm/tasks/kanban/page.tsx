import {
    getTasks,
} from '../actions';


import type {
    Task,
    TaskStatus,
} from '@/types/crm/Tasks';



const columns: TaskStatus[] = [

    'Todo',

    'In Progress',

    'Blocked',

    'Completed',

    'Cancelled',

];



function groupTasks(
    tasks: Task[]
) {

    return columns.map(
        status => ({

            status,

            tasks:
                tasks.filter(
                    task =>
                        task.status === status
                ),

        })
    );

}



export default async function TasksKanbanPage() {


    const tasks =
        await getTasks();


    const board =
        groupTasks(
            tasks
        );



    return (

        <div className="space-y-6">


            <div>

                <h1 className="text-2xl font-semibold">
                    Task Kanban
                </h1>


                <p className="text-sm text-muted-foreground">
                    Visual task workflow management.
                </p>


            </div>



            <div className="grid gap-4 xl:grid-cols-5">


                {
                    board.map(
                        column => (

                            <div

                                key={column.status}

                                className="rounded-lg border bg-muted/20"

                            >


                                <div className="border-b p-4">


                                    <h2 className="font-semibold">

                                        {column.status}

                                    </h2>


                                    <p className="text-sm text-muted-foreground">

                                        {column.tasks.length}
                                        {' '}
                                        tasks

                                    </p>


                                </div>




                                <div className="space-y-3 p-4">


                                    {
                                        column.tasks.map(
                                            task => (

                                                <div

                                                    key={task.id}

                                                    className="rounded-lg border bg-background p-4"

                                                >

                                                    <p className="font-medium">

                                                        {task.title}

                                                    </p>


                                                    <p className="mt-1 text-xs text-muted-foreground">

                                                        {task.taskNumber}

                                                    </p>



                                                    <div className="mt-3 flex justify-between text-xs">

                                                        <span>
                                                            {task.priority}
                                                        </span>


                                                        <span>
                                                            {
                                                                task.dueDate ??
                                                                '-'
                                                            }
                                                        </span>


                                                    </div>


                                                </div>

                                            )
                                        )
                                    }



                                    {
                                        column.tasks.length === 0 && (

                                            <div className="rounded border border-dashed p-4 text-center text-sm text-muted-foreground">

                                                Empty

                                            </div>

                                        )
                                    }


                                </div>


                            </div>

                        )
                    )
                }


            </div>


        </div>

    );

}