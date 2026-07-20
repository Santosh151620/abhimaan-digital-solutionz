export default function TasksLoading() {

    return (

        <div className="space-y-6 animate-pulse">


            <div className="h-8 w-48 rounded bg-muted" />


            <div className="grid gap-4 md:grid-cols-4">


                {
                    Array.from(
                        {
                            length:4
                        }
                    )
                    .map(
                        (_, index) => (

                            <div

                                key={index}

                                className="h-24 rounded-lg border bg-muted"

                            />

                        )
                    )
                }


            </div>



            <div className="h-64 rounded-lg border bg-muted" />


        </div>

    );

}