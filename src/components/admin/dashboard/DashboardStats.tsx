interface DashboardStatsProps {

    organizations: number;

    users: number;

    modules: number;

    audits: number;

}


export default function DashboardStats({

    organizations,

    users,

    modules,

    audits,

}: DashboardStatsProps) {


    const stats = [

        {
            label: "Organizations",
            value: organizations,
        },

        {
            label: "Users",
            value: users,
        },

        {
            label: "Modules",
            value: modules,
        },

        {
            label: "Audit Events",
            value: audits,
        },

    ];


    return (

        <div className="grid gap-4 md:grid-cols-4">


            {
                stats.map((item) => (

                    <div

                        key={item.label}

                        className="
                            rounded-lg
                            border
                            bg-background
                            p-4
                        "

                    >

                        <p className="text-sm text-muted-foreground">

                            {item.label}

                        </p>


                        <p className="mt-2 text-2xl font-semibold">

                            {item.value}

                        </p>


                    </div>

                ))
            }


        </div>

    );

}