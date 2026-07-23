'use client';


import {
    useState,
} from 'react';



import ActivityForm from './ActivityForm';

import ActivityTable from './ActivityTable';

import ActivitySummary from './ActivitySummary';



import type {
    Activity,
} from '@/types/crm/Activity';



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



    const summary = {

        total:
            activities.length,

        planned:
            activities.filter(
                item =>
                    item.status === 'Planned',
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