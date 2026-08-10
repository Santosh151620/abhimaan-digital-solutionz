"use client";

import {
    Bell,
    Building2,
    CheckCircle2,
    FileText,
    Wrench,
    X,
} from "lucide-react";


interface Props {

    open: boolean;

    onClose: () => void;

}


const notifications = [
    {
        icon: Building2,
        title: "New Company Registered",
        description: "A new organization joined CRM.",
        time: "2 min ago",
    },
    {
        icon: FileText,
        title: "Invoice Generated",
        description: "New invoice is ready for review.",
        time: "15 min ago",
    },
    {
        icon: Wrench,
        title: "Asset Assigned",
        description: "Asset assignment completed.",
        time: "42 min ago",
    },
    {
        icon: CheckCircle2,
        title: "Contract Approved",
        description: "Contract workflow completed.",
        time: "1 hour ago",
    },
];


export default function NotificationDrawer({
    open,
    onClose,
}: Props) {

    return (

        <>

            {
                open && (

                    <div

                        aria-hidden="true"

                        onClick={onClose}

                        className="
                            fixed
                            inset-0
                            z-40
                            bg-black/60
                            backdrop-blur-sm
                        "

                    />

                )
            }



            <aside

                aria-label="Notifications"

                className={

                    [
                        "fixed",
                        "right-0",
                        "top-0",
                        "z-50",
                        "h-screen",
                        "w-full",
                        "max-w-md",
                        "border-l",
                        "border-amber-200/10",
                        "bg-gradient-to-b",
                        "from-[#241b10]",
                        "via-[#17120b]",
                        "to-[#0f1115]",
                        "shadow-2xl",
                        "shadow-black/50",
                        "backdrop-blur-xl",
                        "transition-transform",
                        "duration-300",

                        open
                            ? "translate-x-0"
                            : "translate-x-full",

                    ].join(" ")

                }

            >


                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-white/10
                    px-6
                    py-5
                ">


                    <div className="
                        flex
                        items-center
                        gap-3
                    ">


                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-amber-300/10
                            text-amber-200
                        ">

                            <Bell
                                size={20}
                            />

                        </div>



                        <div>

                            <h2 className="
                                text-lg
                                font-semibold
                                text-white
                            ">
                                Notifications
                            </h2>


                            <p className="
                                text-xs
                                text-stone-400
                            ">
                                Latest CRM activities
                            </p>

                        </div>


                    </div>



                    <button

                        type="button"

                        onClick={onClose}

                        aria-label="Close notifications"

                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-white/10
                            text-stone-400
                            transition
                            hover:border-amber-300/30
                            hover:bg-white/10
                            hover:text-white
                        "

                    >

                        <X
                            size={18}
                        />

                    </button>


                </div>





                <div className="
                    space-y-3
                    overflow-y-auto
                    p-5
                ">


                    {
                        notifications.map(
                            (item) => {

                                const Icon =
                                    item.icon;


                                return (

                                    <div

                                        key={
                                            item.title
                                        }

                                        className="
                                            rounded-xl
                                            border
                                            border-white/10
                                            bg-white/[0.04]
                                            p-4
                                            transition
                                            hover:border-amber-300/30
                                            hover:bg-white/[0.07]
                                        "

                                    >


                                        <div className="
                                            flex
                                            gap-3
                                        ">


                                            <div className="
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-amber-300/10
                                                text-amber-200
                                            ">

                                                <Icon
                                                    size={18}
                                                />

                                            </div>




                                            <div className="
                                                min-w-0
                                            ">


                                                <p className="
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                ">
                                                    {item.title}
                                                </p>



                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-stone-400
                                                ">
                                                    {item.description}
                                                </p>



                                                <p className="
                                                    mt-2
                                                    text-[11px]
                                                    text-stone-500
                                                ">
                                                    {item.time}
                                                </p>


                                            </div>


                                        </div>


                                    </div>

                                );

                            }
                        )
                    }


                </div>


            </aside>


        </>

    );

}