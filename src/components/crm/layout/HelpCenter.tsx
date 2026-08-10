"use client";

import {
    BookOpen,
    HelpCircle,
    LifeBuoy,
    Search,
} from "lucide-react";


interface Props {

    onClick?: () => void;

}


const helpItems = [
    {
        icon: Search,
        label: "Search Knowledge Base",
    },
    {
        icon: BookOpen,
        label: "Documentation",
    },
    {
        icon: LifeBuoy,
        label: "Raise Support Ticket",
    },
];


export default function HelpCenter({
    onClick,
}: Props) {

    return (

        <button

            type="button"

            onClick={onClick}

            aria-label="Open help center"

            title="Help Center"

            className="
                fixed
                bottom-6
                right-6
                z-40
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                border
                border-amber-300/30
                bg-gradient-to-br
                from-amber-400
                via-yellow-500
                to-stone-500
                text-[#17120b]
                shadow-2xl
                shadow-amber-900/30
                transition-all
                duration-200
                hover:scale-110
                hover:brightness-110
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-amber-300/60
            "

        >

            <HelpCircle
                aria-hidden="true"
                className="h-7 w-7"
            />

        </button>

    );

}




export function HelpPanel() {

    return (

        <div

            role="dialog"

            aria-label="Help Center"

            className="
                fixed
                bottom-24
                right-6
                z-40
                w-80
                rounded-2xl
                border
                border-white/10
                bg-gradient-to-b
                from-[#241b10]
                via-[#17120b]
                to-[#0f1115]
                p-5
                text-white
                shadow-2xl
                shadow-black/50
            "

        >

            <h2 className="
                mb-4
                text-lg
                font-bold
            ">
                Help Center
            </h2>


            <div className="space-y-3">

                {
                    helpItems.map(
                        (item) => {

                            const Icon =
                                item.icon;


                            return (

                                <button

                                    key={
                                        item.label
                                    }

                                    type="button"

                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        rounded-xl
                                        border
                                        border-transparent
                                        p-3
                                        text-sm
                                        text-stone-300
                                        transition
                                        hover:border-amber-300/20
                                        hover:bg-white/[0.06]
                                        hover:text-white
                                    "

                                >

                                    <Icon
                                        aria-hidden="true"
                                        className="
                                            h-5
                                            w-5
                                            text-amber-200
                                        "
                                    />


                                    <span>
                                        {item.label}
                                    </span>


                                </button>

                            );

                        }
                    )
                }

            </div>


        </div>

    );

}