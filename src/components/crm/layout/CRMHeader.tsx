"use client";

import {
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    Bell,
    UserCircle2,
    Palette,
    Search,
    Command,
} from "lucide-react";

import NotificationDrawer from "./NotificationDrawer";
import ProfileDrawer from "./ProfileDrawer";


export default function CRMHeader() {

    const router =
        useRouter();


    const [notificationsOpen, setNotificationsOpen] =
        useState(false);


    const [profileOpen, setProfileOpen] =
        useState(false);



    return (

        <>

            <header
                className="
                    sticky
                    top-0
                    z-40
                    border-b
                    border-amber-200/10
                    bg-gradient-to-r
                    from-[#17120b]
                    via-[#241b10]
                    to-[#0f1115]
                    shadow-lg
                    shadow-black/20
                    backdrop-blur-2xl
                "
            >

                <div
                    className="
                        relative
                        mx-auto
                        flex
                        min-h-[68px]
                        w-full
                        max-w-[1800px]
                        items-center
                        justify-between
                        gap-4
                        px-3
                        sm:px-4
                        md:px-5
                        lg:px-6
                        xl:px-8
                        2xl:px-10
                    "
                >

                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            inset-x-0
                            bottom-0
                            h-px
                            bg-gradient-to-r
                            from-transparent
                            via-amber-300/40
                            to-transparent
                        "
                    />


                    {/* Workspace Identity */}

                    <div className="min-w-0 shrink-0">

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    hidden
                                    h-8
                                    w-1
                                    rounded-full
                                    bg-gradient-to-b
                                    from-amber-300
                                    via-yellow-500
                                    to-stone-400
                                    sm:block
                                "
                            />


                            <div className="min-w-0">

                                <p
                                    className="
                                        truncate
                                        text-[15px]
                                        font-semibold
                                        tracking-tight
                                        text-white
                                        sm:text-base
                                    "
                                >
                                    CRM Workspace
                                </p>


                                <p
                                    className="
                                        hidden
                                        truncate
                                        text-[10px]
                                        font-medium
                                        uppercase
                                        tracking-[0.16em]
                                        text-stone-400
                                        sm:block
                                    "
                                >
                                    Business Intelligence Workspace
                                </p>

                            </div>

                        </div>

                    </div>





                    {/* Controls */}

                    <div
                        className="
                            ml-auto
                            flex
                            min-w-0
                            items-center
                            gap-2
                            sm:gap-2.5
                        "
                    >


                        {/* Search */}

                        <div
                            className="
                                hidden
                                min-w-0
                                md:flex
                                md:w-[220px]
                                lg:w-[280px]
                                xl:w-[340px]
                            "
                        >

                            <label
                                htmlFor="crm-global-search"
                                className="
                                    flex
                                    h-10
                                    w-full
                                    items-center
                                    rounded-xl
                                    border
                                    border-stone-400/20
                                    bg-white/[0.04]
                                    px-3
                                    transition
                                    focus-within:border-amber-300/40
                                "
                            >

                                <Search
                                    className="
                                        mr-2.5
                                        h-4
                                        w-4
                                        text-stone-400
                                    "
                                />


                                <input
                                    id="crm-global-search"
                                    type="search"
                                    placeholder="Search CRM..."
                                    className="
                                        min-w-0
                                        flex-1
                                        bg-transparent
                                        text-sm
                                        text-white
                                        outline-none
                                        placeholder:text-stone-500
                                    "
                                />


                                <span
                                    className="
                                        hidden
                                        items-center
                                        gap-1
                                        rounded-md
                                        border
                                        border-stone-400/20
                                        bg-black/20
                                        px-1.5
                                        py-1
                                        text-[9px]
                                        text-stone-400
                                        lg:flex
                                    "
                                >

                                    <Command className="h-2.5 w-2.5"/>

                                    K

                                </span>

                            </label>

                        </div>





                        {/* Theme */}

                        <button
                            type="button"
                            aria-label="Open theme settings"
                            title="Appearance"
                            onClick={() =>
                                router.push(
                                    "/crm/settings/theme",
                                )
                            }
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-amber-200/20
                                bg-white/[0.04]
                                text-stone-300
                                transition
                                hover:border-amber-300/50
                                hover:bg-amber-300/10
                                hover:text-amber-200
                            "
                        >

                            <Palette className="h-[17px] w-[17px]" />

                        </button>





                        {/* Notifications */}

                        <button
                            type="button"
                            onClick={() =>
                                setNotificationsOpen(true)
                            }
                            className="
                                relative
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-stone-400/20
                                bg-white/[0.04]
                                text-stone-300
                                transition
                                hover:border-amber-300/40
                                hover:text-amber-200
                            "
                        >

                            <Bell className="h-[17px] w-[17px]" />


                            <span
                                className="
                                    absolute
                                    right-2
                                    top-2
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-amber-300
                                    shadow-[0_0_10px_rgba(251,191,36,0.8)]
                                "
                            />

                        </button>





                        {/* Profile */}

                        <button
                            type="button"
                            onClick={() =>
                                setProfileOpen(true)
                            }
                            className="
                                flex
                                h-10
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-amber-300/30
                                bg-gradient-to-r
                                from-amber-500/20
                                via-stone-400/10
                                to-white/5
                                px-3
                                text-white
                                shadow-lg
                                shadow-amber-900/20
                            "
                        >

                            <UserCircle2
                                className="
                                    h-[18px]
                                    w-[18px]
                                    text-amber-200
                                "
                            />


                            <span
                                className="
                                    hidden
                                    text-xs
                                    font-semibold
                                    sm:block
                                "
                            >
                                Admin
                            </span>


                        </button>


                    </div>


                </div>

            </header>





            <NotificationDrawer
                open={notificationsOpen}
                onClose={() =>
                    setNotificationsOpen(false)
                }
            />



            <ProfileDrawer
                open={profileOpen}
                onClose={() =>
                    setProfileOpen(false)
                }
            />


        </>

    );

}