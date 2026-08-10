"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Activity,
    BarChart3,
    Bell,
    BookOpen,
    Boxes,
    Briefcase,
    Building2,
    CalendarDays,
    CheckSquare,
    ChevronLeft,
    ChevronRight,
    FileText,
    GitBranch,
    LayoutDashboard,
    PanelLeftClose,
    PanelLeftOpen,
    Receipt,
    ScrollText,
    Search,
    Settings,
    Ticket,
    UserRound,
    Users,
} from "lucide-react";

import { enabledModules } from "@/config/crm/modules.generated";

type NavIcon = ComponentType<{ className?: string }>;

type NavItem = {
    label: string;
    href: string;
    icon: NavIcon;
    module?: keyof typeof enabledModules;
};

const primaryItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Companies",
        href: "/dashboard/companies",
        icon: Building2,
    },
    {
        label: "Contacts",
        href: "/dashboard/contacts",
        icon: Users,
    },
    {
        label: "Leads",
        href: "/dashboard/leads",
        icon: UserRound,
    },
    {
        label: "Opportunities",
        href: "/dashboard/opportunities",
        icon: Briefcase,
    },
    {
        label: "Pipeline",
        href: "/dashboard/pipeline",
        icon: GitBranch,
    },
];

const operationsItems: NavItem[] = [
    {
        label: "Quotations",
        href: "/dashboard/quotations",
        icon: FileText,
    },
    {
        label: "Contracts",
        href: "/dashboard/contracts",
        icon: ScrollText,
    },
    {
        label: "Invoices",
        href: "/dashboard/invoices",
        icon: Receipt,
    },
    {
        label: "Payments",
        href: "/dashboard/payments",
        icon: Receipt,
    },
    {
        label: "Projects",
        href: "/dashboard/projects",
        icon: Boxes,
    },
    {
        label: "Assets",
        href: "/dashboard/assets",
        icon: Boxes,
    },
    {
        label: "Tasks",
        href: "/dashboard/tasks",
        icon: CheckSquare,
    },
    {
        label: "Activities",
        href: "/dashboard/activities",
        icon: Activity,
    },
    {
        label: "Calendar",
        href: "/dashboard/calendar",
        icon: CalendarDays,
    },
    {
        label: "Tickets",
        href: "/dashboard/tickets",
        icon: Ticket,
    },
];

const intelligenceItems: NavItem[] = [
    {
        label: "Reports",
        href: "/dashboard/reports",
        icon: BarChart3,
    },
    {
        label: "Knowledge Base",
        href: "/dashboard/knowledge-base",
        icon: BookOpen,
    },
    {
        label: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
    },
    {
        label: "Search",
        href: "/dashboard/search",
        icon: Search,
    },
];

const platformItems: NavItem[] = [
    {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

function isItemEnabled(item: NavItem): boolean {
    if (!item.module) {
        return true;
    }

    return Boolean(enabledModules[item.module]);
}

function isItemActive(pathname: string, href: string): boolean {
    if (href === "/dashboard") {
        return pathname === "/dashboard";
    }

    return (
        pathname === href ||
        pathname.startsWith(`${href}/`)
    );
}

function SidebarLink({
    item,
    active,
    collapsed,
}: {
    item: NavItem;
    active: boolean;
    collapsed: boolean;
}) {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            title={collapsed ? item.label : undefined}
            aria-label={collapsed ? item.label : undefined}
            aria-current={active ? "page" : undefined}
            className={[
                "group relative flex min-h-11 w-full items-center rounded-xl border",
                "transition-all duration-200 ease-out",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2",
                "focus-visible:ring-offset-[#07101f]",
                collapsed
                    ? "justify-center px-2"
                    : "justify-between px-3",
                active
                    ? [
                          "border-cyan-400/25",
                          "bg-gradient-to-r",
                          "from-cyan-400/15",
                          "via-cyan-400/[0.08]",
                          "to-transparent",
                          "text-white",
                          "shadow-lg",
                          "shadow-cyan-950/20",
                      ].join(" ")
                    : [
                          "border-transparent",
                          "text-slate-300",
                          "hover:border-white/10",
                          "hover:bg-white/[0.055]",
                          "hover:text-white",
                      ].join(" "),
            ].join(" ")}
        >
            {active && (
                <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.65)]"
                />
            )}

            <div
                className={[
                    "flex min-w-0 items-center",
                    collapsed
                        ? "justify-center"
                        : "gap-3",
                ].join(" ")}
            >
                <Icon
                    aria-hidden="true"
                    className={[
                        "h-[18px] w-[18px] shrink-0",
                        "transition-colors duration-200",
                        active
                            ? "text-cyan-300"
                            : "text-slate-400 group-hover:text-white",
                    ].join(" ")}
                />

                {!collapsed && (
                    <span className="truncate text-sm font-medium">
                        {item.label}
                    </span>
                )}
            </div>

            {!collapsed && (
                <ChevronRight
                    aria-hidden="true"
                    className={[
                        "h-4 w-4 shrink-0",
                        "transition-all duration-200",
                        active
                            ? "text-cyan-300"
                            : "text-slate-600 group-hover:translate-x-0.5 group-hover:text-slate-300",
                    ].join(" ")}
                />
            )}
        </Link>
    );
}

function SidebarSection({
    title,
    items,
    pathname,
    collapsed,
}: {
    title: string;
    items: NavItem[];
    pathname: string;
    collapsed: boolean;
}) {
    const visibleItems = items.filter(isItemEnabled);

    if (visibleItems.length === 0) {
        return null;
    }

    return (
        <section
            aria-label={collapsed ? undefined : title}
            className="space-y-2"
        >
            {!collapsed ? (
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    {title}
                </div>
            ) : (
                <div
                    aria-hidden="true"
                    className="mx-auto mb-2 h-px w-7 bg-white/10"
                />
            )}

            <div className="space-y-1">
                {visibleItems.map((item) => (
                    <SidebarLink
                        key={item.href}
                        item={item}
                        active={isItemActive(
                            pathname,
                            item.href,
                        )}
                        collapsed={collapsed}
                    />
                ))}
            </div>
        </section>
    );
}

export default function CRMSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            aria-label="CRM navigation"
            className={[
                "relative hidden shrink-0 flex-col",
                "border-r border-white/10",
                "bg-[#07101f]/95",
                "shadow-2xl shadow-black/20",
                "backdrop-blur-2xl",
                "transition-[width] duration-300 ease-in-out",
                "lg:flex",
                "h-[calc(100vh-0px)]",
                "max-h-screen",
                collapsed
                    ? "w-[76px]"
                    : "w-[280px]",
            ].join(" ")}
        >
            {/* Sidebar Header */}
            <div
                className={[
                    "shrink-0 border-b border-white/10",
                    "transition-all duration-300",
                    collapsed
                        ? "px-3 py-5"
                        : "px-5 py-6",
                ].join(" ")}
            >
                <div
                    className={[
                        "flex items-center",
                        collapsed
                            ? "justify-center"
                            : "gap-3",
                    ].join(" ")}
                >
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 shadow-lg shadow-cyan-500/20">
                        <LayoutDashboard
                            aria-hidden="true"
                            className="h-5 w-5 text-white"
                        />

                        <span
                            aria-hidden="true"
                            className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#07101f] bg-emerald-400"
                        />
                    </div>

                    {!collapsed && (
                        <div className="min-w-0">
                            <h2 className="truncate text-base font-bold tracking-tight text-white">
                                Abhimaan CRM
                            </h2>

                            <p className="mt-0.5 truncate text-[11px] text-slate-400">
                                Business Intelligence Platform
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav
                aria-label="CRM modules"
                className={[
                    "flex-1 overflow-x-hidden overflow-y-auto",
                    "px-3 py-5",
                    "scrollbar-thin",
                    "scrollbar-track-transparent",
                    "scrollbar-thumb-white/10",
                    "[scrollbar-gutter:stable]",
                ].join(" ")}
            >
                <div className="space-y-6">
                    <SidebarSection
                        title="Workspace"
                        items={primaryItems}
                        pathname={pathname}
                        collapsed={collapsed}
                    />

                    <SidebarSection
                        title="Operations"
                        items={operationsItems}
                        pathname={pathname}
                        collapsed={collapsed}
                    />

                    <SidebarSection
                        title="Intelligence"
                        items={intelligenceItems}
                        pathname={pathname}
                        collapsed={collapsed}
                    />

                    <SidebarSection
                        title="Platform"
                        items={platformItems}
                        pathname={pathname}
                        collapsed={collapsed}
                    />
                </div>
            </nav>

            {/* Platform Status */}
            {!collapsed && (
                <div className="shrink-0 border-t border-white/10 p-3">
                    <div className="rounded-2xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.08] via-white/[0.025] to-amber-300/[0.04] p-4">
                        <div className="flex items-center gap-2">
                            <span
                                aria-hidden="true"
                                className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.55)]"
                            />

                            <p className="text-xs font-semibold text-white">
                                Platform Ready
                            </p>
                        </div>

                        <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                            Multi-tenant, RBAC, automation and
                            AI-ready architecture.
                        </p>
                    </div>
                </div>
            )}

            {/* Collapse / Expand Control */}
            <button
                type="button"
                onClick={() =>
                    setCollapsed((value) => !value)
                }
                aria-label={
                    collapsed
                        ? "Expand CRM sidebar"
                        : "Collapse CRM sidebar"
                }
                aria-expanded={!collapsed}
                title={
                    collapsed
                        ? "Expand sidebar"
                        : "Collapse sidebar"
                }
                className={[
                    "absolute -right-3 top-24 z-30",
                    "flex h-7 w-7 items-center justify-center",
                    "rounded-full",
                    "border border-white/15",
                    "bg-slate-900",
                    "text-slate-300",
                    "shadow-xl shadow-black/30",
                    "transition-all duration-200",
                    "hover:border-cyan-400/30",
                    "hover:bg-slate-800",
                    "hover:text-white",
                    "focus-visible:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-cyan-400/50",
                ].join(" ")}
            >
                {collapsed ? (
                    <PanelLeftOpen
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                    />
                ) : (
                    <PanelLeftClose
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                    />
                )}
            </button>

            {/* Visual Edge */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent"
            />
        </aside>
    );
}