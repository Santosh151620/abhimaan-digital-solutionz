import {

    notFound,

} from 'next/navigation';



import Link from 'next/link';



import {

    notificationService,

} from '@/services/crm/NotificationService';





interface Props {


    params: Promise<{

        id: string;

    }>;


}





export default async function NotificationDetailsPage({

    params,

}: Props) {



    const {

        id,

    } = await params;





    const notification =

        await notificationService.getById(

            id,

        );





    if (!notification) {


        notFound();


    }





    return (

        <div className="space-y-6">



            <div className="crm-card p-8">



                <h1 className="crm-title">

                    {notification.title}

                </h1>




                <div className="mt-6 space-y-4">



                    <div>


                        <p className="text-sm text-slate-500">

                            Message

                        </p>


                        <p>

                            {notification.message}

                        </p>


                    </div>




                    <div>


                        <p className="text-sm text-slate-500">

                            Type

                        </p>


                        <p>

                            {notification.type}

                        </p>


                    </div>





                    <div>


                        <p className="text-sm text-slate-500">

                            Priority

                        </p>


                        <p>

                            {notification.priority}

                        </p>


                    </div>





                    <div>


                        <p className="text-sm text-slate-500">

                            Status

                        </p>


                        <p>

                            {

                                notification.read

                                    ? 'Read'

                                    : 'Unread'

                            }

                        </p>


                    </div>



                </div>



            </div>





            <Link

                href={`/crm/notifications/${id}/edit`}

                className="rounded border px-4 py-2 text-sm"

            >

                Edit Notification

            </Link>



        </div>

    );


}