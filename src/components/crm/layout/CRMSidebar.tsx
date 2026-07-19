"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Building2,
    Users,
    Briefcase,
    GitBranch,
    FileText,
    ScrollText,
    Receipt,
    Boxes,
    Ticket,
    Settings,
    ChevronRight,
} from "lucide-react";

import { enabledModules } from "@/config/crm/modules.generated";

type NavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    module?: keyof typeof enabledModules;
};

const primaryItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/crm",
        icon: LayoutDashboard,
    },
    {
        label: "Companies",
        href: "/crm/companies",
        icon: Building2,
    },
    {
        label: "Contacts",
        href: "/crm/contacts",
        icon: Users,
    },
    {
        label: "Opportunities",
        href: "/crm/opportunities",
        icon: Briefcase,
    },
    {
        label: "Pipeline",
        href: "/crm/pipeline",
        icon: GitBranch,
    },
];

const operationsItems: NavItem[] = [
    {
        label: "Quotations",
        href: "/crm/quotations",
        icon: FileText,
    },
    {
        label: "Contracts",
        href: "/crm/contracts",
        icon: ScrollText,
    },
    {
        label: "Invoices",
        href: "/crm/invoices",
        icon: Receipt,
    },
    {
        label: "Assets",
        href: "/crm/assets",
        icon: Boxes,
    },
    {
        label: "Tickets",
        href: "/crm/tickets",
        icon: Ticket,
    },
];

const platformItems: NavItem[] = [
    {
        label: "Settings",
        href: "/crm/settings",
        icon: Settings,
    },
];

function SidebarLink({
    item,
    active,
}: {
    item: NavItem;
    active: boolean;
}) {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                active
                    ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 shadow-lg shadow-cyan-500/10"
                    : "text-slate-300 hover:border hover:border-white/10 hover:bg-white/5 hover:text-white"
            }`}
        >
            <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${active ? "text-cyan-300" : "text-slate-400 group-hover:text-white"}`} />
                <span>{item.label}</span>
            </div>

            <ChevronRight className={`h-4 w-4 transition-transform ${active ? "text-cyan-300" : "text-slate-500 group-hover:translate-x-0.5 group-hover:text-slate-300"}`} />
        </Link>
    );
}

function SidebarSection({
    title,
    items,
    pathname,
}: {
    title: string;
    items: NavItem[];
    pathname: string;
}) {
    const visibleItems = items.filter((item) => {
        if (!item.module) return true;
        return enabledModules[item.module];
    });

    if (!visibleItems.length) return null;

    return (
        <div className="space-y-2">
            <div className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                {title}
            </div>

            <div className="space-y-1">
                {visibleItems.map((item) => {
                    const active =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                    return (
                        <SidebarLink
                            key={item.href}
                            item={item}
                            active={active}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default function CRMSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[rgba(4,10,22,.92)] backdrop-blur-2xl lg:flex lg:flex-col">
            <div className="border-b border-white/10 px-6 py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-lg shadow-cyan-500/20">
                        <LayoutDashboard className="h-6 w-6 text-white" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Abhimaan CRM
                        </h2>

                        <p className="text-xs text-slate-400">
                            Enterprise Business Suite
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
                <SidebarSection
                    title="Workspace"
                    items={primaryItems}
                    pathname={pathname}
                />

                <SidebarSection
                    title="Operations"
                    items={operationsItems}
                    pathname={pathname}
                />

                <SidebarSection
                    title="Platform"
                    items={platformItems}
                    pathname={pathname}
                />
            </div>

            <div className="border-t border-white/10 px-4 py-4">
                <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent p-4">
                    <p className="text-sm font-semibold text-white">
                        Enterprise Ready
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        Multi-tenant, RBAC, automation and AI-ready architecture enabled.
                    </p>
                </div>
            </div>
        </aside>
    );
}