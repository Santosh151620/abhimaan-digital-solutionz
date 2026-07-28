interface SystemHealthCardProps {

    status?: "Healthy" | "Warning" | "Critical";

    lastChecked?: string;

}


export default function SystemHealthCard({

    status = "Healthy",

    lastChecked,

}: SystemHealthCardProps) {


    const statusStyle = {

        Healthy:
            "text-green-600",

        Warning:
            "text-yellow-600",

        Critical:
            "text-red-600",

    };


    return (

        <div
            className="
                rounded-xl
                border
                bg-background
                p-6
            "
        >

            <h2 className="text-lg font-semibold">

                System Health

            </h2>


            <div className="mt-4 flex items-center justify-between">


                <span
                    className={`font-semibold ${statusStyle[status]}`}
                >

                    {status}

                </span>


                {
                    lastChecked && (

                        <span className="text-xs text-muted-foreground">

                            Checked {lastChecked}

                        </span>

                    )
                }


            </div>


        </div>

    );

}