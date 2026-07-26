interface Props {

    stages: number;

    opportunities: number;

    value: number;

}



export default function PipelineSummary({

    stages,

    opportunities,

    value,

}: Props) {


    const formattedValue =
        new Intl.NumberFormat(
            'en-IN',
            {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
            },
        ).format(
            value,
        );



    return (

        <div className="grid gap-4 md:grid-cols-3">


            <div className="rounded-lg border p-4">

                <div className="text-sm">
                    Stages
                </div>

                <div className="text-2xl font-bold">
                    {stages}
                </div>

            </div>



            <div className="rounded-lg border p-4">

                <div className="text-sm">
                    Opportunities
                </div>

                <div className="text-2xl font-bold">
                    {opportunities}
                </div>

            </div>



            <div className="rounded-lg border p-4">

                <div className="text-sm">
                    Pipeline Value
                </div>

                <div className="text-2xl font-bold">

                    {formattedValue}

                </div>

            </div>


        </div>

    );

}