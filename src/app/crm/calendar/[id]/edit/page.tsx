import {
    notFound,
} from 'next/navigation';


import {
    getCalendarEvent,
} from '../../actions';


import {
    CalendarForm,
} from '@/components/crm/calendar';



interface Props {

    params: Promise<{
        id:string;
    }>;

}



export default async function EditCalendarPage({
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
                Edit Calendar Event
            </h1>


            <CalendarForm

                initialValues={
                    event
                }

            />


        </div>

    );

}