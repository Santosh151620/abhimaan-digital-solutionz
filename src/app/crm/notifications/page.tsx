import {

    getNotifications,

} from './actions';



import {

    NotificationClient,

} from '@/components/crm/notifications';





export default async function NotificationsPage() {



    const notifications =

        await getNotifications();





    return (

        <div className="space-y-6">



            <div className="crm-card p-8">


                <h1 className="crm-title">

                    Notifications

                </h1>


                <p className="crm-subtitle mt-2">

                    Manage CRM alerts, reminders and system notifications.

                </p>


            </div>





            <NotificationClient

                initialNotifications={notifications}

            />



        </div>

    );


}