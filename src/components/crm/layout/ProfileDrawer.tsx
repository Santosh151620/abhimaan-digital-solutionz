"use client";

import {
    Globe,
    LogOut,
    Palette,
    Settings,
    Shield,
    User,
    X,
} from "lucide-react";


interface Props {

    open: boolean;

    onClose: () => void;

}


const menu = [
    {
        icon: User,
        title: "My Profile",
    },
    {
        icon: Settings,
        title: "Settings",
    },
    {
        icon: Palette,
        title: "Change Theme",
    },
    {
        icon: Globe,
        title: "Change Language",
    },
    {
        icon: Shield,
        title: "Security",
    },
    {
        icon: LogOut,
        title: "Log Out",
    },
];


export default function ProfileDrawer({
    open,
    onClose,
}: Props) {


    return (

        <>


            {
                open && (

                    <div

                        onClick={onClose}

                        className="
                            fixed
                            inset-0
                            z-40
                            bg-black/50
                            backdrop-blur-sm
                        "

                    />

                )
            }



            <aside

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
                        "border-white/10",
                        "bg-slate-950/95",
                        "shadow-2xl",
                        "shadow-black/40",
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


                    <h2 className="
                        text-lg
                        font-semibold
                        text-white
                    ">
                        Administrator
                    </h2>



                    <button

                        type="button"

                        onClick={onClose}

                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-white/10
                            text-slate-400
                            hover:bg-white/10
                            hover:text-white
                        "

                    >

                        <X size={18}/>

                    </button>


                </div>




                <div className="
                    border-b
                    border-white/10
                    px-6
                    py-6
                    text-center
                ">


                    <div className="
                        mx-auto
                        flex
                        h-24
                        w-24
                        items-center
                        justify-center
                        rounded-full
                        bg-gradient-to-br
                        from-cyan-400
                        via-blue-500
                        to-indigo-600
                        text-3xl
                        font-bold
                        text-white
                        shadow-lg
                    ">

                        A

                    </div>



                    <h3 className="
                        mt-4
                        text-xl
                        font-semibold
                        text-white
                    ">
                        Administrator
                    </h3>



                    <p className="
                        mt-1
                        text-sm
                        text-emerald-400
                    ">
                        ● Online
                    </p>


                </div>




                <div className="
                    space-y-2
                    p-5
                ">


                    {
                        menu.map(
                            (item) => {

                                const Icon =
                                    item.icon;


                                return (

                                    <button

                                        key={
                                            item.title
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
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            text-slate-300
                                            transition
                                            hover:border-white/10
                                            hover:bg-white/[0.06]
                                            hover:text-white
                                        "

                                    >

                                        <Icon
                                            size={18}
                                        />


                                        <span>
                                            {item.title}
                                        </span>


                                    </button>

                                );

                            }
                        )
                    }


                </div>


            </aside>


        </>

    );

}