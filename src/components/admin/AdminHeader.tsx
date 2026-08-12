import Link from "next/link";


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
    {
        name: "Logout",
        href: "/admin/logout",
    },
];


export default function AdminHeader() {

    return (

        <header
            className="
                flex
                h-16
                items-center
                justify-between
                border-b
                border-white/10
                bg-[#0b0b0b]
                px-6
            "
        >

            <div>

                <h1
                    className="
                        text-lg
                        font-semibold
                        text-white
                    "
                >
                    Admin Portal
                </h1>

                <p
                    className="
                        text-sm
                        text-slate-400
                    "
                >
                    Platform administration and configuration
                </p>

            </div>


            <div className="flex items-center gap-3">


                <div
                    className="
                        hidden
                        items-center
                        gap-2
                        xl:flex
                    "
                >

                    {actions.map((action) => (

                        <Link
                            key={action.href}
                            href={action.href}
                            className="
                                rounded-lg
                                border
                                border-white/10
                                px-3
                                py-2
                                text-sm
                                text-slate-300
                                transition
                                hover:border-amber-300/30
                                hover:text-amber-300
                            "
                        >
                            {action.name}
                        </Link>

                    ))}

                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        border
                        border-white/10
                        px-3
                        py-2
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
                            bg-amber-300
                            text-sm
                            font-bold
                            text-black
                        "
                    >
                        A
                    </div>


                    <div className="hidden sm:block">

                        <p
                            className="
                                text-sm
                                font-medium
                                text-white
                            "
                        >
                            Administrator
                        </p>

                        <p
                            className="
                                text-xs
                                text-slate-500
                            "
                        >
                            Organization Admin
                        </p>

                    </div>

                </div>


            </div>

        </header>

    );

}