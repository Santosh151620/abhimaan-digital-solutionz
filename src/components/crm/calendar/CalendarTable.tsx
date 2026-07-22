'use client';

import Link from 'next/link';

import type {
    CalendarEvent,
} from '@/types/crm/Calendar';


interface Props {

    events: CalendarEvent[];

}


export default function CalendarTable({
    events,
}: Props) {


    if(events.length === 0) {

        return (

            <div className="rounded-xl border p-8 text-center text-muted-foreground">
                No calendar events found.
            </div>

        );

    }


    return (

        <div className="overflow-x-auto rounded-xl border">

            <table className="w-full">


                <thead>

                    <tr className="border-b bg-muted/40 text-left">

                        <th className="p-3">
                            Event
                        </th>

                        <th className="p-3">
                            Status
                        </th>

                        <th className="p-3">
                            Start
                        </th>

                        <th className="p-3">
                            End
                        </th>

                        <th className="p-3 text-right">
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {
                        events.map(event => (

                            <tr
                                key={event.id}
                                className="border-b hover:bg-muted/30"
                            >

                                <td className="p-3">

                                    <div className="font-medium">
                                        {event.title}
                                    </div>

                                </td>


                                <td className="p-3">
                                    {event.status}
                                </td>


                                <td className="p-3">
                                    {event.startDate ?? '-'}
                                </td>


                                <td className="p-3">
                                    {event.endDate ?? '-'}
                                </td>


                                <td className="p-3 text-right">

                                    <Link
                                        href={`/crm/calendar/${event.id}`}
                                        className="rounded border px-3 py-1 text-sm"
                                    >
                                        View
                                    </Link>

                                </td>


                            </tr>

                        ))
                    }


                </tbody>


            </table>


        </div>

    );

}