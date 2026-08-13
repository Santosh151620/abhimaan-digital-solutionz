"use client";

import Link from "next/link";

import {
    usePathname,
} from "next/navigation";


const actions = [

    {
        name: "Profile",
        href: "/admin/profile",
    },

    {
        name: "Security",
        href: "/admin/security",
    },

    {
        name: "Settings",
        href: "/admin/settings",
    },

    {
        name: "Language",
        href: "/admin/change-language",
    },

    {
        name: "Theme",
        href: "/admin/change-theme",
    },

];



export default function AdminHeader() {


    const pathname =
        usePathname();



    function active(
        href:string,
    ) {

        return pathname === href;

    }



    return (

        <header

            className="
                flex
                h-16
                items-center
                justify-between
                border-b
                border-border
                bg-background
                px-6
            "

        >


            <div>

                <h1

                    className="
                        text-lg
                        font-semibold
                        text-foreground
                    "

                >

                    Admin Portal

                </h1>


                <p

                    className="
                        text-sm
                        text-muted-foreground
                    "

                >

                    Platform administration and configuration

                </p>


            </div>





            <div

                className="
                    flex
                    items-center
                    gap-3
                "

            >


                <nav

                    className="
                        hidden
                        items-center
                        gap-2
                        xl:flex
                    "

                    aria-label="Admin shortcuts"

                >

                    {
                        actions.map(
                            action => (

                                <Link

                                    key={action.href}

                                    href={action.href}

                                    className={`
                                        rounded-lg
                                        border
                                        px-3
                                        py-2
                                        text-sm
                                        transition
                                        ${
                                            active(action.href)
                                            ?
                                            "border-primary/30 bg-primary/10 text-primary"
                                            :
                                            "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }
                                    `}

                                >

                                    {action.name}

                                </Link>

                            ),
                        )
                    }


                </nav>





                <Link

                    href="/admin/profile"

                    className="
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        border
                        border-border
                        px-3
                        py-2
                        transition
                        hover:bg-muted
                    "

                >


                    <div

                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-primary
                            text-sm
                            font-bold
                            text-primary-foreground
                        "

                    >

                        A

                    </div>




                    <div

                        className="
                            hidden
                            sm:block
                        "

                    >

                        <p

                            className="
                                text-sm
                                font-medium
                                text-foreground
                            "

                        >

                            Administrator

                        </p>



                        <p

                            className="
                                text-xs
                                text-muted-foreground
                            "

                        >

                            Organization Admin

                        </p>


                    </div>


                </Link>


            </div>


        </header>

    );

}