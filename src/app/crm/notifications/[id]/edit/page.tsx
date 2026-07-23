'use client';


import {

    useState,

} from 'react';



import {

    useRouter,

} from 'next/navigation';



import {

    updateNotification,

} from '../../actions';





interface Props {


    params: Promise<{

        id: string;

    }>;


}





export default function EditNotificationPage({

    params,

}: Props) {



    const router =

        useRouter();





    const [

        title,

        setTitle,

    ] = useState('');



    const [

        message,

        setMessage,

    ] = useState('');





    async function handleSubmit(

        event: React.FormEvent<HTMLFormElement>,

    ) {


        event.preventDefault();




        const {

            id,

        } = await params;





        await updateNotification(

            id,

            {

                title,

                message,

            },

        );




        router.push(

            `/crm/notifications/${id}`,

        );


    }





    return (

        <form

            onSubmit={handleSubmit}

            className="crm-card space-y-5 p-8"

        >



            <h1 className="crm-title">

                Edit Notification

            </h1>





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

            />





            <button

                type="submit"

                className="rounded bg-primary px-4 py-2 text-primary-foreground"

            >

                Update

            </button>



        </form>

    );


}