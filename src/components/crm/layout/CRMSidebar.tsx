"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    Building2,
    Users,
    Boxes,
    FileSignature,
    Receipt,
    Ticket,
    Settings,
    Sparkles,
} from "lucide-react";

const menu = [

    {
        title: "Dashboard",
        href: "/crm",
        icon: LayoutDashboard,
    },

    {
        title: "Companies",
        href: "/crm/companies",
        icon: Building2,
    },

    {
        title: "Contacts",
        href: "/crm/contacts",
        icon: Users,
    },

    {
        title: "Assets",
        href: "/crm/assets",
        icon: Boxes,
    },

    {
        title: "Contracts",
        href: "/crm/contracts",
        icon: FileSignature,
    },

    {
        title: "Invoices",
        href: "/crm/invoices",
        icon: Receipt,
    },

    {
        title: "Tickets",
        href: "/crm/tickets",
        icon: Ticket,
    },

];

export default function CRMSidebar() {

    const pathname = usePathname();

    return (

        <aside className="flex w-72 flex-col border-r border-white/10 bg-gradient-to-b from-[#061321] via-[#081827] to-[#031018] text-white">

            <div className="border-b border-white/10 p-8">

                <div className="flex items-center gap-3">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-emerald-500 shadow-[0_0_35px_rgba(34,211,238,.4)]">

                        <Sparkles size={28} />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold tracking-wide">

                            Abhimaan CRM

                        </h2>

                        <p className="text-xs text-cyan-300">

                            Enterprise Suite

                        </p>

                    </div>

                </div>

            </div>

            <nav className="flex-1 space-y-2 p-5">

                {menu.map((item) => {

                    const Icon = item.icon;

                    const active =
                        pathname === item.href;

                    return (

                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300

${
active
? "bg-gradient-to-r from-cyan-600 to-blue-700 shadow-lg"
: "hover:bg-white/5"
}`}

                        >

                            <Icon
                                size={19}
                                className="text-cyan-300"
                            />

                            <span className="font-medium">

                                {item.title}

                            </span>

                        </Link>

                    );

                })}

            </nav>

            <div className="border-t border-white/10 p-5">

                <Link

                    href="/crm/configure"

                    className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 transition hover:bg-cyan-500/20"

                >

                    <Settings size={18} />

                    Configure

                </Link>

            </div>

        </aside>

    );

}