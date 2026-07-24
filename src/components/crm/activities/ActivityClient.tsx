'use client';

import {
    useState,
} from 'react';

import ActivityForm from './ActivityForm';
import ActivityTable from './ActivityTable';
import ActivitySummary from './ActivitySummary';

import type {
    Activity,
} from '@/types/crm/Activities';


interface Props {
    initialActivities: Activity[];
}


export default function ActivityClient({

    initialActivities,

}: Props) {


    const [activities] =
        useState<Activity[]>(
            initialActivities,
        );


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

        console.log(
            'Create Activity',
            values,
        );

    }



    return (

        <div className="space-y-8">

            <ActivitySummary

                summary={summary}

            />


            <ActivityForm

                onSubmit={createActivity}

            />


            <ActivityTable

                activities={activities}

            />

        </div>

    );

}