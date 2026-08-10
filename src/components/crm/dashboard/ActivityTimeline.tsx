import {
    Building2,
    FileText,
    Wrench,
    CheckCircle2,
} from "lucide-react";


const activities = [
    {
        icon: Building2,
        title: "Company Created",
        description: "New organization added to CRM",
        time: "09:10 AM",
        color: "text-blue-700",
        badge: "bg-blue-100",
    },
    {
        icon: FileText,
        title: "Invoice Generated",
        description: "Revenue document processed",
        time: "09:45 AM",
        color: "text-emerald-700",
        badge: "bg-emerald-100",
    },
    {
        icon: Wrench,
        title: "Asset Assigned",
        description: "Asset allocation completed",
        time: "10:15 AM",
        color: "text-amber-700",
        badge: "bg-amber-100",
    },
    {
        icon: CheckCircle2,
        title: "Contract Approved",
        description: "Agreement workflow completed",
        time: "11:00 AM",
        color: "text-green-700",
        badge: "bg-green-100",
    },
];


export default function ActivityTimeline() {

    return (

        <section
            className="
                overflow-hidden
                rounded-3xl
                border
                border-amber-200/40
                bg-gradient-to-br
                from-white
                via-[#faf7f0]
                to-[#e7dcc8]
                p-6
                shadow-xl
            "
        >

            <div
                className="
                    mb-6
                    flex
                    items-center
                    justify-between
                "
            >

                <div>

                    <h2
                        className="
                            text-xl
                            font-black
                            tracking-tight
                            text-slate-900
                        "
                    >
                        Recent Activity
                    </h2>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        Latest CRM workspace events
                    </p>

                </div>

            </div>


            <div className="space-y-5">

                {activities.map((item) => {

                    const Icon = item.icon;


                    return (

                        <div
                            key={item.time}
                            className="
                                flex
                                items-start
                                gap-4
                                rounded-2xl
                                border
                                border-white/60
                                bg-white/50
                                p-4
                                transition-all
                                duration-200
                                hover:bg-white
                            "
                        >

                            <div
                                className={`
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    ${item.badge}
                                    ${item.color}
                                `}
                            >

                                <Icon
                                    size={19}
                                />

                            </div>


                            <div className="min-w-0 flex-1">

                                <p
                                    className="
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    {item.title}
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    {item.description}
                                </p>


                                <p
                                    className="
                                        mt-2
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-slate-400
                                    "
                                >
                                    {item.time}
                                </p>

                            </div>

                        </div>

                    );

                })}

            </div>

        </section>

    );
}