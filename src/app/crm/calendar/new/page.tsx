import Link from 'next/link';

import {
    CalendarForm,
} from '@/components/crm/calendar';

import {
    createCalendarEvent,
} from '../actions';


export default function NewCalendarEventPage() {


    async function submit(
        data: FormData,
    ) {

        'use server';


        await createCalendarEvent({

            title:
                String(
                    data.get('title') ?? ''
                ),

            description:
                String(
                    data.get('description') ?? ''
                ),

            startDate:
                String(
                    data.get('startDate') ?? ''
                ),

            endDate:
                String(
                    data.get('endDate') ?? ''
                ),

        });

    }


    return (

        <div className="space-y-6">


            <h1 className="text-2xl font-semibold">
                Create Calendar Event
            </h1>


            <form
                action={submit}
                className="space-y-6"
            >

                <CalendarForm />

                <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    Save Event
                </button>

            </form>


            <Link
                href="/crm/calendar"
                className="text-sm underline"
            >
                Back to Calendar
            </Link>


        </div>

    );

}