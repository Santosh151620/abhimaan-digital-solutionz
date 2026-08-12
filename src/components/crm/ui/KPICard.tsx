import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";


interface Props {

    title: string;

    value: string;

    change?: string;

    icon: ReactNode;

    color?: string;

    description?: string;

}


export default function KPICard({

    title,

    value,

    change,

    icon,

    color = "bg-cyan-400/10 text-cyan-300",

    description,

}: Props) {


    return (

        <div
            className="
                group
                min-w-0
                overflow-hidden
                rounded-2xl
                border
                border-cyan-400/10
                bg-slate-950/80
                backdrop-blur-xl
                shadow-xl
                shadow-black/20
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-400/25
                hover:shadow-cyan-950/20
            "
        >

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                    p-5
                "
            >

                <div className="min-w-0">

                    <p
                        className="
                            truncate
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            text-slate-400
                        "
                    >
                        {title}
                    </p>


                    <p
                        className="
                            mt-3
                            truncate
                            text-3xl
                            font-black
                            tracking-tight
                            text-white
                        "
                    >
                        {value}
                    </p>


                    {description && (

                        <p
                            className="
                                mt-2
                                text-xs
                                leading-relaxed
                                text-slate-500
                            "
                        >
                            {description}
                        </p>

                    )}


                    {change && (

                        <div
                            className="
                                mt-4
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-emerald-400/20
                                bg-emerald-400/10
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-emerald-300
                            "
                        >

                            <ArrowUpRight
                                size={14}
                            />

                            {change}

                        </div>

                    )}

                </div>


                <div
                    className={`
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-white/10
                        transition-transform
                        duration-300
                        group-hover:scale-105
                        ${color}
                    `}
                >

                    {icon}

                </div>

            </div>


            <div
                className="
                    h-1
                    w-full
                    bg-gradient-to-r
                    from-cyan-400/70
                    via-blue-400/40
                    to-transparent
                "
            />

        </div>

    );

}