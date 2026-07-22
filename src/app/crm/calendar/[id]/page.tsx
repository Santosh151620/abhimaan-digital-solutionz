import {
    notFound,
} from 'next/navigation';


import {
    getCalendarEvent,
} from '../actions';



interface Props {

    params: Promise<{
        id:string;
    }>;

}



export default async function CalendarDetailsPage({
    params,
}: Props) {


    const {
        id,
    } = await params;


    const event =
        await getCalendarEvent(
            id
        );


    if(!event) {

        notFound();

    }



    return (

        <div className="space-y-6">


            <h1 className="text-2xl font-semibold">
                {event.title}
            </h1>


            <div className="rounded-xl border p-6 space-y-3">


                <p>
                    Status: {event.status}
                </p>


                <p>
                    Type: {event.eventType}
                </p>


                <p>
                    Start: {event.startDate}
                </p>


                <p>
                    End: {event.endDate}
                </p>


                <p>
                    {event.description}
                </p>


            </div>


        </div>

    );

}