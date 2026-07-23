'use client';


import {

    useState,

} from 'react';



import {

    createNotification,

} from '@/app/crm/notifications/actions';



import type {

    Notification,

} from '@/types/crm/Notification';





interface Props {


    onCreated?: (

        notification: Notification,

    ) => void;


}




export default function NotificationForm({

    onCreated,

}: Props) {



    const [

        title,

        setTitle,

    ] = useState('');



    const [

        message,

        setMessage,

    ] = useState('');



    const [

        loading,

        setLoading,

    ] = useState(false);





    async function handleSubmit(

        event: React.FormEvent<HTMLFormElement>,

    ) {


        event.preventDefault();



        setLoading(true);




        const notification =

            await createNotification({

                title,

                message,

                type: 'Info',

                priority: 'Medium',

            });





        onCreated?.(

            notification,

        );



        setTitle('');

        setMessage('');

        setLoading(false);


    }





    return (

        <form

            onSubmit={handleSubmit}

            className="crm-card space-y-4 p-6"

        >



            <h2 className="crm-title">

                Create Notification

            </h2>




            <input

                className="w-full rounded border p-2"

                placeholder="Title"

                value={title}

                onChange={

                    event =>

                        setTitle(

                            event.target.value,

                        )

                }

                required

            />





            <textarea

                className="w-full rounded border p-2"

                placeholder="Message"

                value={message}

                onChange={

                    event =>

                        setMessage(

                            event.target.value,

                        )

                }

                required

            />





            <button

                type="submit"

                disabled={loading}

                className="rounded bg-primary px-4 py-2 text-primary-foreground"

            >

                {

                    loading

                        ? 'Saving...'

                        : 'Create'

                }

            </button>



        </form>

    );


}