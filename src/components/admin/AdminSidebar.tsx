"use client";

import Link from "next/link";

import {
    usePathname,
    useRouter,
} from "next/navigation";


const navigation = [

    {
        title: "Dashboard",
        items: [
            {
                name: "Dashboard",
                href: "/admin/dashboard",
            },
        ],
    },


    {
        title: "Organization",
        items: [

            {
                name: "Organizations",
                href: "/admin/organizations",
            },

            {
                name: "Branches",
                href: "/admin/branches",
            },

            {
                name: "Locations",
                href: "/admin/locations",
            },

            {
                name: "Departments",
                href: "/admin/departments",
            },

            {
                name: "Designations",
                href: "/admin/designations",
            },

            {
                name: "Teams",
                href: "/admin/teams",
            },

        ],
    },


    {
        title: "Identity & Access",
        items: [

            {
                name: "Users",
                href: "/admin/users",
            },

            {
                name: "Roles",
                href: "/admin/roles",
            },

            {
                name: "Role Permissions",
                href: "/admin/role-permissions",
            },

            {
                name: "Permissions",
                href: "/admin/permissions",
            },

            {
                name: "Policies",
                href: "/admin/policies",
            },

        ],
    },


    {
        title: "Platform",
        items: [

            {
                name: "Modules",
                href: "/admin/modules",
            },

            {
                name: "Workflows",
                href: "/admin/workflows",
            },

            {
                name: "Notifications",
                href: "/admin/notifications",
            },

        ],
    },


    {
        title: "Monitoring",
        items: [

            {
                name: "Audit Logs",
                href: "/admin/audit-logs",
            },

            {
                name: "Health",
                href: "/admin/health",
            },

        ],
    },

];



const accountNavigation = [

    {
        name: "My Profile",
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

];



export default function AdminSidebar() {


    const pathname =
        usePathname();


    const router =
        useRouter();




    function isActive(
        href:string,
    ) {

        return pathname === href;

    }





    function logout() {

        router.push(
            "/admin/logout",
        );

    }




    return (

        <aside

            className="
                hidden
                w-72
                shrink-0
                border-r
                border-border
                bg-background
                lg:flex
                lg:flex-col
            "

        >


            <div

                className="
                    flex
                    h-16
                    items-center
                    border-b
                    border-border
                    px-6
                "

            >

                <Link

                    href="/admin/dashboard"

                    className="
                        text-lg
                        font-bold
                    "

                >

                    ADS Admin

                </Link>


            </div>




            <nav

                className="
                    flex-1
                    overflow-y-auto
                    p-4
                "

            >


                {
                    navigation.map(
                        section => (

                            <div

                                key={section.title}

                                className="mb-6"

                            >

                                <p

                                    className="
                                        mb-2
                                        px-3
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-muted-foreground
                                    "

                                >

                                    {section.title}

                                </p>



                                <div

                                    className="
                                        space-y-1
                                    "

                                >

                                    {
                                        section.items.map(
                                            item => (

                                                <Link

                                                    key={item.href}

                                                    href={item.href}

                                                    className={`
                                                        block
                                                        rounded-lg
                                                        px-3
                                                        py-2
                                                        text-sm
                                                        transition
                                                        ${
                                                            isActive(
                                                                item.href,
                                                            )
                                                            ?
                                                            "bg-primary/10 text-primary font-semibold"
                                                            :
                                                            "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        }
                                                    `}

                                                >

                                                    {item.name}

                                                </Link>

                                            ),
                                        )
                                    }

                                </div>


                            </div>

                        ),
                    )
                }





                <div

                    className="
                        border-t
                        border-border
                        pt-5
                    "

                >


                    <p

                        className="
                            mb-2
                            px-3
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                            text-muted-foreground
                        "

                    >

                        Account

                    </p>



                    {
                        accountNavigation.map(
                            item => (

                                <Link

                                    key={item.href}

                                    href={item.href}

                                    className={`
                                        block
                                        rounded-lg
                                        px-3
                                        py-2
                                        text-sm
                                        ${
                                            isActive(item.href)
                                            ?
                                            "bg-primary/10 text-primary font-semibold"
                                            :
                                            "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }
                                    `}

                                >

                                    {item.name}

                                </Link>

                            ),
                        )
                    }




                    <button

                        type="button"

                        onClick={logout}

                        className="
                            mt-4
                            w-full
                            rounded-lg
                            border
                            border-border
                            px-3
                            py-2
                            text-left
                            text-sm
                            text-muted-foreground
                            hover:bg-muted
                            hover:text-foreground
                        "

                    >

                        Logout

                    </button>


                </div>


            </nav>


        </aside>

    );

}