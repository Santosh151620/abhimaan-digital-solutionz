import {
    notFound,
} from 'next/navigation';


import Link from 'next/link';


import {
    ActivityForm,
} from '@/components/crm/activities';


import {
    ActivityServiceInstance,
} from '@/services/crm/ActivityService';



interface Props {

    params: Promise<{
        id: string;
    }>;

}



export default async function EditActivityPage({

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


            <div>

                <h1 className="text-2xl font-semibold">

                    Edit Activity

                </h1>


                <p className="text-sm text-muted-foreground">

                    Update activity details.

                </p>


            </div>




            <ActivityForm

                initialValues={
                    activity
                }

                onSubmit={
                    async () => {}
                }

            />



            <Link

                href={`/crm/activities/${id}`}

                className="text-sm underline"

            >

                Back to Activity

            </Link>



        </div>

    );

}