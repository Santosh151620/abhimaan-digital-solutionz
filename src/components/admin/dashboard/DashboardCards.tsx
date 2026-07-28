interface DashboardCardItem {

    title: string;

    value: string | number;

    description?: string;

}


interface DashboardCardsProps {

    cards: DashboardCardItem[];

}


export default function DashboardCards({

    cards,

}: DashboardCardsProps) {


    return (

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">


            {
                cards.map((card) => (

                    <div

                        key={card.title}

                        className="
                            rounded-xl
                            border
                            bg-background
                            p-6
                        "

                    >

                        <p className="text-sm text-muted-foreground">

                            {card.title}

                        </p>


                        <h2 className="mt-3 text-3xl font-bold">

                            {card.value}

                        </h2>


                        {
                            card.description && (

                                <p className="mt-2 text-xs text-muted-foreground">

                                    {card.description}

                                </p>

                            )
                        }


                    </div>

                ))
            }


        </section>

    );

}