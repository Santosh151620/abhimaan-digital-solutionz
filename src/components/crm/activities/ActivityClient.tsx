'use client';

import {
    useState,
} from 'react';

import ActivityForm from './ActivityForm';
import ActivityTable from './ActivityTable';
import ActivitySummary from './ActivitySummary';

import {
    createActivity as createActivityAction,
} from '@/app/crm/activities/actions';

import type {
    Activity,
} from '@/types/crm/Activities';


interface Props {
    initialActivities: Activity[];
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



    const today =
        new Date()
            .toISOString()
            .split('T')[0];



    const summary = {

        total:
            activities.length,

        planned:
            activities.filter(
                item =>
                    item.status === 'Planned',
            ).length,

        scheduled:
            activities.filter(
                item =>
                    item.status === 'Scheduled',
            ).length,

        pending:
            activities.filter(
                item =>
                    item.status === 'Pending',
            ).length,

        inProgress:
            activities.filter(
                item =>
                    item.status === 'In Progress',
            ).length,

        completed:
            activities.filter(
                item =>
                    item.status === 'Completed',
            ).length,

        cancelled:
            activities.filter(
                item =>
                    item.status === 'Cancelled',
            ).length,

        missed:
            activities.filter(
                item =>
                    item.status === 'Missed',
            ).length,

        overdue:
            activities.filter(
                item =>
                    item.dueDate
                    &&
                    item.dueDate < today
                    &&
                    item.status !== 'Completed',
            ).length,

        today:
            activities.filter(
                item =>
                    item.dueDate === today,
            ).length,

        upcoming:
            activities.filter(
                item =>
                    item.dueDate
                    &&
                    item.dueDate > today,
            ).length,

        highPriority:
            activities.filter(
                item =>
                    item.priority === 'High'
                    ||
                    item.priority === 'Critical',
            ).length,

        archived:
            0,

        completionRate:
            activities.length === 0
                ? 0
                :
                Math.round(
                    (
                        activities.filter(
                            item =>
                                item.status === 'Completed',
                        ).length
                        /
                        activities.length
                    )
                    *
                    100,
                ),

    };



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



    return (

        <div className="space-y-8">


            <ActivitySummary

                summary={summary}

            />



            <ActivityForm

                onSubmit={createActivity}

                loading={loading}

            />



            <ActivityTable

                activities={activities}

            />


        </div>

    );

}
