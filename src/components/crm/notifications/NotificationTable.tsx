'use client';


import type {

    Notification,

} from '@/types/crm/Notification';



import {

    deleteNotification,

} from '@/app/crm/notifications/actions';





interface Props {


    notifications: Notification[];


    onDeleted?: (

        id: string,

    ) => void;


}





export default function NotificationTable({

    notifications,

    onDeleted,

}: Props) {





    async function handleDelete(

        id: string,

    ) {



        await deleteNotification(

            id,

        );



        onDeleted?.(

            id,

        );


    }





    return (

        <div className="crm-card overflow-x-auto p-6">



            <h2 className="crm-title mb-4">

                Notifications

            </h2>




            <table className="w-full text-sm">



                <thead>

                    <tr className="border-b text-left">


                        <th className="p-2">

                            Title

                        </th>



                        <th className="p-2">

                            Type

                        </th>



                        <th className="p-2">

                            Priority

                        </th>



                        <th className="p-2">

                            Status

                        </th>



                        <th className="p-2">

                            Action

                        </th>


                    </tr>

                </thead>





                <tbody>


                    {

                        notifications.map(

                            notification => (


                                <tr

                                    key={notification.id}

                                    className="border-b"

                                >



                                    <td className="p-2">

                                        {notification.title}

                                    </td>




                                    <td className="p-2">

                                        {notification.type}

                                    </td>




                                    <td className="p-2">

                                        {notification.priority}

                                    </td>




                                    <td className="p-2">

                                        {

                                            notification.read

                                                ? 'Read'

                                                : 'Unread'

                                        }

                                    </td>




                                    <td className="p-2">


                                        <button

                                            type="button"

                                            onClick={

                                                () =>

                                                    handleDelete(

                                                        notification.id,

                                                    )

                                            }

                                            className="text-sm text-red-600"

                                        >

                                            Delete

                                        </button>


                                    </td>




                                </tr>


                            ),

                        )

                    }



                    {

                        notifications.length === 0 && (


                            <tr>


                                <td

                                    colSpan={5}

                                    className="p-4 text-center text-slate-500"

                                >

                                    No notifications found

                                </td>


                            </tr>


                        )

                    }



                </tbody>



            </table>



        </div>

    );


}