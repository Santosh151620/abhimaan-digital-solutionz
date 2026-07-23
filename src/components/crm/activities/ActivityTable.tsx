'use client';

import Link from 'next/link';


import type {
    Activity,
} from '@/types/crm/Activity';



interface Props {

    activities: Activity[];

}



export default function ActivityTable({

    activities,

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


            <table className="w-full">


                <thead>


                    <tr className="border-b bg-muted/40 text-left">


                        <th className="p-3">

                            Activity

                        </th>


                        <th className="p-3">

                            Type

                        </th>


                        <th className="p-3">

                            Status

                        </th>


                        <th className="p-3">

                            Priority

                        </th>


                        <th className="p-3">

                            Start

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

                                            <div className="text-sm text-muted-foreground">

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

                                    {activity.startDate ?? '-'}

                                </td>




                                <td className="p-3 text-right">


                                    <Link

                                        href={`/crm/activities/${activity.id}`}

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