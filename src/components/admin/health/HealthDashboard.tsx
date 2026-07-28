"use client";


const healthItems = [

    {
        name: "Database",
        status: "Healthy",
    },

    {
        name: "Authentication",
        status: "Healthy",
    },

    {
        name: "API Services",
        status: "Healthy",
    },

];



export function HealthDashboard() {


    return (

        <section className="grid gap-5 md:grid-cols-3">


            {
                healthItems.map(
                    (item) => (

                        <div
                            key={item.name}
                            className="rounded-xl border bg-background p-6"
                        >

                            <h2 className="font-semibold">
                                {item.name}
                            </h2>


                            <p className="mt-3 text-sm text-muted-foreground">
                                {item.status}
                            </p>


                        </div>

                    )
                )
            }


        </section>

    );

}