import Link from 'next/link';


import {
    notFound,
} from 'next/navigation';



import {
    ActivityServiceInstance,
} from '@/services/crm/ActivityService';



interface Props {

    params: Promise<{
        id: string;
    }>;

}



export default async function ActivityDetailsPage({

    params,

}: Props) {



    const {
        id,
    } = await params;



    const activity =
        ActivityServiceInstance.details(
            id,
        );



    if (!activity) {

        notFound();

    }



    return (

        <div className="space-y-6">


            <div className="rounded-xl border p-6">


                <h1 className="text-2xl font-semibold">

                    {activity.title}

                </h1>



                <div className="mt-4 grid gap-4 md:grid-cols-2">


                    <div>

                        <span className="text-sm text-muted-foreground">

                            Type

                        </span>


                        <p>

                            {activity.type}

                        </p>

                    </div>




                    <div>

                        <span className="text-sm text-muted-foreground">

                            Status

                        </span>


                        <p>

                            {activity.status}

                        </p>

                    </div>




                    <div>

                        <span className="text-sm text-muted-foreground">

                            Priority

                        </span>


                        <p>

                            {activity.priority}

                        </p>

                    </div>




                    <div>

                        <span className="text-sm text-muted-foreground">

                            Start Date

                        </span>


                        <p>

                            {activity.startDate || '-'}

                        </p>

                    </div>



                </div>




                {
                    activity.description && (

                        <div className="mt-6">

                            <h2 className="font-semibold">

                                Description

                            </h2>


                            <p className="mt-2 text-sm">

                                {activity.description}

                            </p>


                        </div>

                    )
                }



            </div>




            <Link

                href={`/crm/activities/${activity.id}/edit`}

                className="rounded border px-4 py-2 text-sm"

            >

                Edit Activity

            </Link>



        </div>

    );


}