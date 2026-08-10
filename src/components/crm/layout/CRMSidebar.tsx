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
    BriefcaseBusiness,
    CalendarDays,
    CheckSquare,
    ChevronDown,
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
    Building2,
} from "lucide-react";

import { enabledModules } from "@/config/crm/modules.generated";

type NavIcon = ComponentType<{ className?: string }>;

type NavItem = {
    label: string;
    href: string;
    icon: NavIcon;
    module?: keyof typeof enabledModules;
    children?: NavItem[];
};

const primaryItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Companies",
        href: "/crm/companies",
        icon: Building2,
        children: [
            {
                label: "View Companies",
                href: "/crm/companies",
                icon: Building2,
            },
            {
                label: "Create Company",
                href: "/crm/companies/new",
                icon: Building2,
            },
        ],
    },
    {
        label: "Contacts",
        href: "/crm/contacts",
        icon: Users,
        children: [
            {
                label: "View Contacts",
                href: "/crm/contacts",
                icon: Users,
            },
            {
                label: "Create Contact",
                href: "/crm/contacts/new",
                icon: Users,
            },
        ],
    },
    {
        label: "Leads",
        href: "/crm/leads",
        icon: UserRound,
    },
    {
        label: "Opportunities",
        href: "/crm/opportunities",
        icon: BriefcaseBusiness,
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
        label: "Payments",
        href: "/crm/payments",
        icon: Receipt,
    },
    {
        label: "Projects",
        href: "/crm/projects",
        icon: Boxes,
    },
    {
        label: "Assets",
        href: "/crm/assets",
        icon: Boxes,
    },
    {
        label: "Tasks",
        href: "/crm/tasks",
        icon: CheckSquare,
    },
    {
        label: "Activities",
        href: "/crm/activities",
        icon: Activity,
    },
    {
        label: "Calendar",
        href: "/crm/calendar",
        icon: CalendarDays,
    },
    {
        label: "Tickets",
        href: "/crm/tickets",
        icon: Ticket,
    },
];

const intelligenceItems: NavItem[] = [
    {
        label: "Reports",
        href: "/crm/reports",
        icon: BarChart3,
    },
    {
        label: "Knowledge Base",
        href: "/crm/knowledge-base",
        icon: BookOpen,
    },
    {
        label: "Notifications",
        href: "/crm/notifications",
        icon: Bell,
    },
    {
        label: "Search",
        href: "/crm/search",
        icon: Search,
    },
];

const platformItems: NavItem[] = [
    {
        label: "Settings",
        href: "/crm/settings",
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

function hasActiveChild(
    pathname: string,
    item: NavItem,
): boolean {
    return Boolean(
        item.children?.some((child) =>
            isItemActive(pathname, child.href),
        ),
    );
}

function SidebarLink({
    item,
    active,
    collapsed,
    expanded,
    onToggle,
}: {
    item: NavItem;
    active: boolean;
    collapsed: boolean;
    expanded: boolean;
    onToggle?: () => void;
}) {
    const Icon = item.icon;
    const hasChildren =
        Boolean(item.children?.length);

    const content = (
        <>
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
                <span
                    className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        "transition-all duration-200",
                        active
                            ? "bg-cyan-400/10"
                            : "bg-transparent group-hover:bg-white/[0.06]",
                    ].join(" ")}
                >
                    <Icon
                        aria-hidden="true"
                        className={[
                            "h-[17px] w-[17px] shrink-0",
                            "transition-colors duration-200",
                            active
                                ? "text-cyan-300"
                                : "text-slate-400 group-hover:text-white",
                        ].join(" ")}
                    />
                </span>

                {!collapsed && (
                    <span className="min-w-0 truncate text-sm font-medium">
                        {item.label}
                    </span>
                )}
            </div>

            {!collapsed && hasChildren && (
                <ChevronDown
                    aria-hidden="true"
                    className={[
                        "h-4 w-4 shrink-0 text-slate-500",
                        "transition-transform duration-200",
                        expanded
                            ? "rotate-180 text-cyan-300"
                            : "group-hover:text-slate-300",
                    ].join(" ")}
                />
            )}

            {!collapsed && !hasChildren && (
                <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-transparent transition-colors group-hover:bg-slate-500"
                />
            )}
        </>
    );

    if (hasChildren) {
        return (
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label}`}
                className={[
                    "group relative flex min-h-11 w-full items-center rounded-xl border",
                    "transition-all duration-200 ease-out",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-cyan-400/50",
                    collapsed
                        ? "justify-center px-2"
                        : "justify-between px-2.5",
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
                title={
                    collapsed
                        ? `${item.label} — ${expanded ? "Collapse" : "Expand"}`
                        : undefined
                }
            >
                {content}
            </button>
        );
    }

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
                "focus-visible:ring-cyan-400/50",
                collapsed
                    ? "justify-center px-2"
                    : "justify-between px-2.5",
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
            {content}
        </Link>
    );
}

function SidebarSubmenu({
    item,
    pathname,
    collapsed,
    expanded,
}: {
    item: NavItem;
    pathname: string;
    collapsed: boolean;
    expanded: boolean;
}) {
    if (
        collapsed ||
        !expanded ||
        !item.children?.length
    ) {
        return null;
    }

    return (
        <div className="ml-5 border-l border-white/10 pl-3">
            <div className="space-y-1 py-1">
                {item.children
                    .filter(isItemEnabled)
                    .map((child) => {
                        const ChildIcon = child.icon;
                        const active = isItemActive(
                            pathname,
                            child.href,
                        );

                        return (
                            <Link
                                key={child.href}
                                href={child.href}
                                aria-current={
                                    active
                                        ? "page"
                                        : undefined
                                }
                                className={[
                                    "group flex min-h-9 items-center gap-2 rounded-lg px-2.5",
                                    "text-xs transition-all duration-150",
                                    active
                                        ? "bg-cyan-400/10 text-cyan-200"
                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white",
                                ].join(" ")}
                            >
                                <ChildIcon
                                    aria-hidden="true"
                                    className={[
                                        "h-3.5 w-3.5 shrink-0",
                                        active
                                            ? "text-cyan-300"
                                            : "text-slate-500 group-hover:text-slate-300",
                                    ].join(" ")}
                                />

                                <span className="truncate">
                                    {child.label}
                                </span>
                            </Link>
                        );
                    })}
            </div>
        </div>
    );
}

function SidebarSection({
    title,
    items,
    pathname,
    collapsed,
    expandedItems,
    onToggle,
}: {
    title: string;
    items: NavItem[];
    pathname: string;
    collapsed: boolean;
    expandedItems: Record<string, boolean>;
    onToggle: (href: string) => void;
}) {
    const visibleItems = items.filter(
        isItemEnabled,
    );

    if (visibleItems.length === 0) {
        return null;
    }

    return (
        <section
            aria-label={collapsed ? undefined : title}
            className="space-y-2"
        >
            {!collapsed ? (
                <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    {title}
                </div>
            ) : (
                <div
                    aria-hidden="true"
                    className="mx-auto mb-2 h-px w-7 bg-white/10"
                />
            )}

            <div className="space-y-1">
                {visibleItems.map((item) => {
                    const active =
                        isItemActive(
                            pathname,
                            item.href,
                        ) ||
                        hasActiveChild(
                            pathname,
                            item,
                        );

                    const expanded =
                        Boolean(
                            expandedItems[
                                item.href
                            ],
                        );

                    return (
                        <div key={item.href}>
                            <SidebarLink
                                item={item}
                                active={active}
                                collapsed={
                                    collapsed
                                }
                                expanded={
                                    expanded
                                }
                                onToggle={() =>
                                    onToggle(
                                        item.href,
                                    )
                                }
                            />

                            <SidebarSubmenu
                                item={item}
                                pathname={
                                    pathname
                                }
                                collapsed={
                                    collapsed
                                }
                                expanded={
                                    expanded
                                }
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default function CRMSidebar() {
    const pathname = usePathname();

    const [collapsed, setCollapsed] =
        useState(false);

    const [expandedItems, setExpandedItems] =
        useState<Record<string, boolean>>({
            "/crm/companies": false,
            "/crm/contacts": false,
        });

    function toggleItem(href: string) {
        setExpandedItems((current) => ({
            ...current,
            [href]: !current[href],
        }));
    }

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
                "h-screen max-h-screen",
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
                        : "px-4 py-5",
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
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 shadow-lg shadow-cyan-500/20">
                        <LayoutDashboard
                            aria-hidden="true"
                            className="h-[18px] w-[18px] text-white"
                        />

                        <span
                            aria-hidden="true"
                            className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#07101f] bg-emerald-400"
                        />
                    </div>

                    {!collapsed && (
                        <div className="min-w-0">
                            <h2 className="truncate text-sm font-bold tracking-tight text-white">
                                Abhimaan CRM
                            </h2>

                            <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                Business Intelligence
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
                    "px-3 py-4",
                    "scrollbar-thin",
                    "scrollbar-track-transparent",
                    "scrollbar-thumb-white/10",
                    "[scrollbar-gutter:stable]",
                ].join(" ")}
            >
                <div className="space-y-5">
                    <SidebarSection
                        title="Workspace"
                        items={primaryItems}
                        pathname={pathname}
                        collapsed={collapsed}
                        expandedItems={
                            expandedItems
                        }
                        onToggle={
                            toggleItem
                        }
                    />

                    <SidebarSection
                        title="Operations"
                        items={operationsItems}
                        pathname={pathname}
                        collapsed={collapsed}
                        expandedItems={
                            expandedItems
                        }
                        onToggle={
                            toggleItem
                        }
                    />

                    <SidebarSection
                        title="Intelligence"
                        items={intelligenceItems}
                        pathname={pathname}
                        collapsed={collapsed}
                        expandedItems={
                            expandedItems
                        }
                        onToggle={
                            toggleItem
                        }
                    />

                    <SidebarSection
                        title="Platform"
                        items={platformItems}
                        pathname={pathname}
                        collapsed={collapsed}
                        expandedItems={
                            expandedItems
                        }
                        onToggle={
                            toggleItem
                        }
                    />
                </div>
            </nav>

            {/* Platform Status */}
            {!collapsed && (
                <div className="shrink-0 border-t border-white/10 p-3">
                    <div className="rounded-xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.08] via-white/[0.025] to-amber-300/[0.04] p-3.5">
                        <div className="flex items-center gap-2">
                            <span
                                aria-hidden="true"
                                className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.55)]"
                            />

                            <p className="text-[11px] font-semibold text-white">
                                Platform Ready
                            </p>
                        </div>

                        <p className="mt-1.5 text-[10px] leading-relaxed text-slate-400">
                            Secure multi-tenant CRM
                            workspace.
                        </p>
                    </div>
                </div>
            )}

            {/* Collapse / Expand Control */}
            <button
                type="button"
                onClick={() =>
                    setCollapsed(
                        (value) => !value,
                    )
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
                    "absolute -right-3 top-20 z-30",
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
