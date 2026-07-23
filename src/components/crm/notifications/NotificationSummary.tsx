import type {

    Notification,

} from '@/types/crm/Notification';





interface Props {


    notifications: Notification[];


}





export default function NotificationSummary({

    notifications,

}: Props) {



    const total =

        notifications.length;



    const unread =

        notifications.filter(

            notification =>

                !notification.read,

        ).length;



    const highPriority =

        notifications.filter(

            notification =>

                notification.priority === 'High',

        ).length;





    return (

        <div className="grid gap-4 md:grid-cols-3">



            <div className="crm-card p-5">


                <p className="text-sm text-slate-500">

                    Total Notifications

                </p>


                <p className="mt-2 text-2xl font-semibold">

                    {total}

                </p>


            </div>





            <div className="crm-card p-5">


                <p className="text-sm text-slate-500">

                    Unread

                </p>


                <p className="mt-2 text-2xl font-semibold">

                    {unread}

                </p>


            </div>





            <div className="crm-card p-5">


                <p className="text-sm text-slate-500">

                    High Priority

                </p>


                <p className="mt-2 text-2xl font-semibold">

                    {highPriority}

                </p>


            </div>



        </div>

    );


}