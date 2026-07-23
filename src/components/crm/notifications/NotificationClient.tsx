'use client';


import {

    useState,

} from 'react';



import {

    NotificationForm,

    NotificationTable,

    NotificationSummary,

} from './';



import type {

    Notification,

} from '@/types/crm/Notification';





interface Props {


    initialNotifications: Notification[];


}




export default function NotificationClient({

    initialNotifications,

}: Props) {



    const [

        notifications,

        setNotifications,

    ] = useState<Notification[]>(

        initialNotifications,

    );





    function handleCreated(

        notification: Notification,

    ) {


        setNotifications(

            previous => [

                ...previous,

                notification,

            ],

        );


    }





    function handleDeleted(

        id: string,

    ) {


        setNotifications(

            previous =>

                previous.filter(

                    item =>

                        item.id !== id,

                ),

        );


    }





    return (

        <div className="space-y-6">



            <NotificationSummary

                notifications={notifications}

            />



            <NotificationForm

                onCreated={handleCreated}

            />



            <NotificationTable

                notifications={notifications}

                onDeleted={handleDeleted}

            />



        </div>

    );


}