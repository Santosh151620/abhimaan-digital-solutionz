const items = [
    {
        name: "API",
        status: "Operational",
    },
    {
        name: "Database",
        status: "Healthy",
    },
    {
        name: "Storage",
        status: "Healthy",
    },
    {
        name: "Email",
        status: "Connected",
    },
    {
        name: "Backup",
        status: "Running",
    },
];


export default function SystemHealth() {

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

            <div className="mb-6">

                <h2
                    className="
                        text-xl
                        font-black
                        tracking-tight
                        text-slate-900
                    "
                >
                    System Health
                </h2>


                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    Platform service availability
                </p>

            </div>


            <div className="space-y-4">

                {items.map((item) => (

                    <div
                        key={item.name}
                        className="
                            flex
                            items-center
                            justify-between
                            rounded-2xl
                            border
                            border-white/70
                            bg-white/60
                            px-4
                            py-3
                            transition-all
                            duration-200
                            hover:bg-white
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <span
                                aria-hidden="true"
                                className="
                                    h-2.5
                                    w-2.5
                                    rounded-full
                                    bg-emerald-500
                                    shadow-[0_0_8px_rgba(16,185,129,0.5)]
                                "
                            />


                            <span
                                className="
                                    font-semibold
                                    text-slate-800
                                "
                            >
                                {item.name}
                            </span>

                        </div>


                        <span
                            className="
                                rounded-full
                                border
                                border-emerald-200
                                bg-emerald-50
                                px-3
                                py-1
                                text-xs
                                font-bold
                                text-emerald-700
                            "
                        >
                            {item.status}
                        </span>


                    </div>

                ))}

            </div>

        </section>

    );
}