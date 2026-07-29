'use client';

import {
    useState,
} from 'react';


import {
    ActivityForm,
    ActivitySummary,
    ActivityTable,
} from './index';


import type {
    Activity,
    ActivitySummary as ActivitySummaryType,
} from '@/types/crm/Activities';


import {
    createActivity as createActivityAction,
    deleteActivity as deleteActivityAction,
} from '@/app/crm/activities/actions';



interface Props {

    initialActivities: Activity[];

}



function buildSummary(
    activities: Activity[],
): ActivitySummaryType {

    const today =
        new Date()
            .toISOString()
            .split('T')[0];


    const completed =
        activities.filter(
            activity =>
                activity.status === 'Completed',
        ).length;


    return {

        total:
            activities.length,

        planned:
            activities.filter(
                activity =>
                    activity.status === 'Planned',
            ).length,

        inProgress:
            activities.filter(
                activity =>
                    activity.status === 'In Progress',
            ).length,

        completed,

        cancelled:
            activities.filter(
                activity =>
                    activity.status === 'Cancelled',
            ).length,

        missed:
            activities.filter(
                activity =>
                    activity.status === 'Missed',
            ).length,

        overdue:
            activities.filter(
                activity =>

                    !!activity.dueDate

                    &&

                    activity.dueDate < today

                    &&

                    activity.status !== 'Completed'

                    &&

                    activity.status !== 'Cancelled',

            ).length,

        today:
            activities.filter(
                activity =>
                    activity.startDate === today,
            ).length,

        upcoming:
            activities.filter(
                activity =>

                    !!activity.startDate

                    &&

                    activity.startDate > today,

            ).length,

        highPriority:
            activities.filter(
                activity =>

                    activity.priority === 'High'

                    ||

                    activity.priority === 'Critical',

            ).length,

        archived:
            activities.filter(
                activity =>
                    activity.archived,
            ).length,

        completionRate:

            activities.length === 0

                ? 0

                :

                Math.round(

                    (
                        completed
                        /
                        activities.length
                    )

                    *

                    100,

                ),

    };

}



export default function ActivityClient({

    initialActivities,

}: Props) {


    const [
        activities,
        setActivities,
    ] =
        useState<Activity[]>(
            initialActivities,
        );


    const [
        loading,
        setLoading,
    ] =
        useState(false);



    const summary =
        buildSummary(
            activities,
        );



    async function createActivity(

        values: Partial<Activity>,

    ) {


        try {

            setLoading(true);


            const created =
                await createActivityAction(
                    values,
                );


            if (created) {

                setActivities(
                    previous => [

                        created,

                        ...previous,

                    ],
                );

            }


        } finally {

            setLoading(false);

        }

    }




    async function deleteActivity(

        id: string,

    ) {


        try {

            setLoading(true);


            await deleteActivityAction(
                id,
            );


            setActivities(
                previous =>
                    previous.filter(
                        activity =>
                            activity.id !== id,
                    ),
            );


        } finally {

            setLoading(false);

        }

    }




    return (

        <div className="space-y-8">


            <ActivitySummary

                summary={
                    summary
                }

            />



            <ActivityForm

                onSubmit={
                    createActivity
                }

                loading={
                    loading
                }

            />



            <ActivityTable

                activities={
                    activities
                }

                onDelete={
                    deleteActivity
                }

            />


        </div>

    );

}
