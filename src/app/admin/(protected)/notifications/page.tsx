import {

    getNotifications,

} from "./page-actions";



import NotificationFilters from "@/components/admin/notifications/NotificationFilters";



import NotificationTable from "@/components/admin/notifications/NotificationTable";







export default async function NotificationsPage(){



    const notifications =

        await getNotifications();







    return (



        <div className="space-y-6">







            <div>







                <h1 className="text-3xl font-bold">



                    Notifications



                </h1>









                <p className="text-sm text-gray-500">



                    Manage system notifications and user alerts.



                </p>







            </div>









            <NotificationFilters />









            <NotificationTable



                items={notifications}



            />







        </div>



    );



}