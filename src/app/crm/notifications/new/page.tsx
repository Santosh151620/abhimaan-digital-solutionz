'use client';


import {

    useRouter,

} from 'next/navigation';



import {

    NotificationForm,

} from '@/components/crm/notifications';



import type {

    Notification,

} from '@/types/crm/Notification';



export default function NewNotificationPage() {



    const router =

        useRouter();





    function handleCreated(

        notification: Notification,

    ) {



        console.log(

            'Notification created',

            notification,

        );



        router.push(

            '/crm/notifications',

        );


    }





    return (

        <div className="space-y-6">



            <div className="crm-card p-8">


                <h1 className="crm-title">

                    Create Notification

                </h1>


                <p className="crm-subtitle mt-2">

                    Add a new CRM notification.

                </p>


            </div>




            <NotificationForm

                onCreated={handleCreated}

            />



        </div>

    );


}