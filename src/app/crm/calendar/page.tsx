import Link from 'next/link';

import {
    getCalendarEvents,
} from './actions';

import {
    CalendarClient,
} from '@/components/crm/calendar';


export default async function CalendarPage() {


    const events =
        await getCalendarEvents();



    return (

        <div className="space-y-6">


            <div className="flex items-center justify-between">


                <div>

                    <h1 className="text-2xl font-semibold">
                        Calendar
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage meetings, reminders and business activities.
                    </p>

                </div>


                <Link
                    href="/crm/calendar/new"
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    New Event
                </Link>


            </div>



            <CalendarClient

                initialEvents={
                    events
                }

            />


        </div>

    );

}