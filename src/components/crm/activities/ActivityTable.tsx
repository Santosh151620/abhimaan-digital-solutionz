'use client';

import Link from 'next/link';


import type {
    Activity,
} from '@/types/crm/Activities';



interface Props {

    activities: Activity[];

    onDelete?: (
        id: string,
    ) => void | Promise<void>;

}



export default function ActivityTable({

    activities,

    onDelete,

}: Props) {


    if (activities.length === 0) {

        return (

            <div className="rounded-xl border p-8 text-center text-muted-foreground">

                No activities found.

            </div>

        );

    }



    return (

        <div className="overflow-x-auto rounded-xl border">


            <table className="w-full text-sm">


                <thead className="border-b bg-muted/40">


                    <tr>


                        <th className="p-3 text-left">
                            Activity
                        </th>


                        <th className="p-3 text-left">
                            Type
                        </th>


                        <th className="p-3 text-left">
                            Status
                        </th>


                        <th className="p-3 text-left">
                            Priority
                        </th>


                        <th className="p-3 text-left">
                            Schedule
                        </th>


                        <th className="p-3 text-right">
                            Actions
                        </th>


                    </tr>


                </thead>



                <tbody>


                    {
                        activities.map(activity => (

                            <tr

                                key={activity.id}

                                className="border-b hover:bg-muted/30"

                            >


                                <td className="p-3">


                                    <div className="font-medium">

                                        {activity.title}

                                    </div>



                                    {
                                        activity.description && (

                                            <div className="text-xs text-muted-foreground">

                                                {activity.description}

                                            </div>

                                        )
                                    }


                                </td>



                                <td className="p-3">

                                    {activity.type}

                                </td>



                                <td className="p-3">

                                    {activity.status}

                                </td>



                                <td className="p-3">

                                    {activity.priority}

                                </td>



                                <td className="p-3">

                                    {
                                        activity.startDate
                                        ??
                                        activity.scheduledAt
                                        ??
                                        '-'
                                    }

                                </td>



                                <td className="p-3 text-right">


                                    <div className="flex justify-end gap-2">


                                        <Link

                                            href={`/crm/activities/${activity.id}`}

                                            className="rounded border px-3 py-1 text-sm"

                                        >

                                            View

                                        </Link>



                                        {
                                            onDelete && (

                                                <button

                                                    type="button"

                                                    onClick={() =>
                                                        onDelete(
                                                            activity.id,
                                                        )
                                                    }

                                                    className="rounded border px-3 py-1 text-sm text-destructive"

                                                >

                                                    Delete

                                                </button>

                                            )
                                        }


                                    </div>


                                </td>


                            </tr>


                        ))
                    }


                </tbody>


            </table>


        </div>


    );

}