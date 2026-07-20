import type {
    Activity,
} from '@/types/activity';

import {
    notFound,
} from 'next/navigation';

import TaskEditForm from './TaskEditForm';
import {
    getTaskDetails,
} from './actions';

import {
    getTaskActivities,
} from './activity-actions';

import {
    getTaskAttachments,
} from './attachment-actions';

import TaskAttachments from './TaskAttachments';

interface Props {

    params: Promise<{
        id: string;
    }>;

}



export default async function TaskDetailsPage({
    params,
}: Props) {


    const {
        id,
    } = await params;


    const task =
        await getTaskDetails(
            id
        );


    const activities =
        await getTaskActivities(
            id
        );


    if (!task) {

        notFound();

    }
    const attachments =
        await getTaskAttachments(
            id
        );


    return (

        <div className="space-y-6">


            <div>

                <h1 className="text-2xl font-semibold">
                    {task.title}
                </h1>


                <p className="text-sm text-muted-foreground">
                    {task.taskNumber}
                </p>

            </div>



            <div className="grid gap-4 md:grid-cols-3">


                <div className="rounded-lg border p-4">

                    <p className="text-sm text-muted-foreground">
                        Status
                    </p>

                    <p className="font-medium">
                        {task.status}
                    </p>

                </div>



                <div className="rounded-lg border p-4">

                    <p className="text-sm text-muted-foreground">
                        Priority
                    </p>

                    <p className="font-medium">
                        {task.priority}
                    </p>

                </div>



                <div className="rounded-lg border p-4">

                    <p className="text-sm text-muted-foreground">
                        Due Date
                    </p>

                    <p className="font-medium">
                        {task.dueDate ?? '-'}
                    </p>

                </div>


            </div>



            <div className="rounded-lg border p-6">


                <h2 className="font-semibold mb-4">
                    Description
                </h2>


                <p className="text-sm">
                    {
                        task.description ??
                        'No description available.'
                    }
                </p>


            </div>



            <div className="rounded-lg border p-6">


                <h2 className="font-semibold mb-4">
                    Task Information
                </h2>


                <div className="grid gap-3 md:grid-cols-2">


                    <p>
                        Start Date:
                        {' '}
                        {task.startDate ?? '-'}
                    </p>


                    <p>
                        Estimated Hours:
                        {' '}
                        {task.estimatedHours ?? '-'}
                    </p>


                    <p>
                        Actual Hours:
                        {' '}
                        {task.actualHours ?? '-'}
                    </p>


                    <p>
                        Assigned To:
                        {' '}
                        {task.assignedTo ?? '-'}
                    </p>


                </div>


            </div>

            <TaskAttachments

                taskId={id}

                initialAttachments={attachments}

            />

            <div className="rounded-lg border p-6">


                <h2 className="font-semibold mb-4">
                    Activity Timeline
                </h2>



                <div className="space-y-4">


                    {
                        activities.length === 0 && (

                            <p className="text-sm text-muted-foreground">
                                No activity recorded.
                            </p>

                        )
                    }



                    {
                        activities.map(
                            (
                                activity: Activity) => (

                                <div

                                    key={activity.id}

                                    className="border-b pb-3 last:border-0"

                                >

                                    <p className="font-medium">

                                        {activity.title ?? activity.type}

                                    </p>


                                    <p className="text-sm">

                                        {activity.description}

                                    </p>


                                    <p className="text-xs text-muted-foreground">

                                        {
                                            new Date(
                                                activity.createdAt
                                            ).toLocaleString()
                                        }

                                    </p>


                                </div>

                            )
                        )
                    }


                </div>


            </div>
            <TaskEditForm
                task={task}
            />


        </div>

    );

}