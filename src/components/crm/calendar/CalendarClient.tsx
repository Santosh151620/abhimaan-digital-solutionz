'use client';

import {
    useState,
} from 'react';

import {
    CalendarForm,
    CalendarTable,
} from './index';

import type {
    CalendarEvent,
} from '@/types/crm/Calendar';


interface Props {

    initialEvents: CalendarEvent[];

}


export default function CalendarClient({
    initialEvents,
}: Props) {


    const [events, setEvents] =
        useState<CalendarEvent[]>(
            initialEvents
        );


    const [showForm, setShowForm] =
        useState(false);



    async function createEvent(
        values: Partial<CalendarEvent>
    ) {


        if (
            !values.title ||
            !values.startDate ||
            !values.endDate
        ) {

            return;

        }


        const now =
            new Date().toISOString();



        const event: CalendarEvent = {

            id:
                crypto.randomUUID(),


            eventNumber:
                `EVT-${Date.now()}`,


            title:
                values.title,


            description:
                values.description ?? '',


            eventType:
                values.eventType ?? 'Meeting',


            priority:
                values.priority ?? 'Medium',


            startDate:
                values.startDate,


            endDate:
                values.endDate,


            allDay:
                values.allDay ?? false,


            status:
                values.status ?? 'Scheduled',


            archived:
                false,


            createdAt:
                now,


            updatedAt:
                now,

        };


        setEvents(previous => [
            ...previous,
            event,
        ]);


        setShowForm(false);

    }



    return (

        <div className="space-y-6">


            <div className="flex items-center justify-between">


                <h2 className="text-xl font-semibold">
                    Calendar
                </h2>


                <button
                    onClick={() => setShowForm(true)}
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    New Event
                </button>


            </div>



            {
                showForm && (

                    <CalendarForm

                        onSubmit={
                            createEvent
                        }

                        onCancel={
                            () => setShowForm(false)
                        }

                    />

                )
            }



            <CalendarTable

                events={
                    events
                }

            />


        </div>

    );

}