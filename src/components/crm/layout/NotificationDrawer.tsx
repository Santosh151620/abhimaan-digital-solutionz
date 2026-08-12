"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from "react";

import {
    Bell,
    Building2,
    CheckCircle2,
    FileText,
    Wrench,
    X,
} from "lucide-react";

interface NotificationItem {
    id: string;
    icon: typeof Building2;
    title: string;
    description: string;
    time: string;
    unread?: boolean;
}

interface Props {
    open: boolean;
    onClose: () => void;
}

const notifications: NotificationItem[] = [
    {
        id: "company-registered",
        icon: Building2,
        title: "New Company Registered",
        description:
            "A new organization joined CRM.",
        time: "2 min ago",
        unread: true,
    },
    {
        id: "invoice-generated",
        icon: FileText,
        title: "Invoice Generated",
        description:
            "New invoice is ready for review.",
        time: "15 min ago",
        unread: true,
    },
    {
        id: "asset-assigned",
        icon: Wrench,
        title: "Asset Assigned",
        description:
            "Asset assignment completed.",
        time: "42 min ago",
        unread: false,
    },
    {
        id: "contract-approved",
        icon: CheckCircle2,
        title: "Contract Approved",
        description:
            "Contract workflow completed.",
        time: "1 hour ago",
        unread: false,
    },
];

export default function NotificationDrawer({
    open,
    onClose,
}: Props) {
    const closeButtonRef =
        useRef<HTMLButtonElement | null>(null);

    const previouslyFocusedElementRef =
        useRef<HTMLElement | null>(null);

    const unreadCount = useMemo(
        () =>
            notifications.filter(
                (notification) =>
                    notification.unread === true,
            ).length,
        [],
    );

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    /*
     * Drawer lifecycle:
     * - lock page scrolling while open
     * - remember the element that opened the drawer
     * - move focus into the drawer
     * - restore focus when the drawer closes
     * - close on Escape
     */
    useEffect(() => {
        if (!open) {
            return;
        }

        previouslyFocusedElementRef.current =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const handleKeyDown = (
            event: globalThis.KeyboardEvent,
        ) => {
            if (event.key === "Escape") {
                event.preventDefault();
                handleClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown,
        );

        const focusTimer = window.setTimeout(() => {
            closeButtonRef.current?.focus();
        }, 0);

        return () => {
            document.body.style.overflow =
                previousOverflow;

            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );

            window.clearTimeout(focusTimer);
        };
    }, [open, handleClose]);

    /*
     * Restore focus after the drawer closes.
     */
    useEffect(() => {
        if (open) {
            return;
        }

        const element =
            previouslyFocusedElementRef.current;

        if (!element) {
            return;
        }

        const restoreTimer =
            window.setTimeout(() => {
                if (document.contains(element)) {
                    element.focus();
                }

                previouslyFocusedElementRef.current =
                    null;
            }, 0);

        return () => {
            window.clearTimeout(restoreTimer);
        };
    }, [open]);

    return (
        <>
            {/* Backdrop */}
            <div
                aria-hidden="true"
                onClick={open ? handleClose : undefined}
                className={[
                    "fixed inset-0 z-40",
                    "bg-black/60",
                    "backdrop-blur-sm",
                    "transition-opacity duration-300",
                    open
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0",
                ].join(" ")}
            />

            {/* Notification drawer */}
            <aside
                id="crm-notification-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby="crm-notification-title"
                aria-describedby="crm-notification-description"
                aria-hidden={!open}
                className={[
                    "fixed right-0 top-0 z-50",
                    "flex h-dvh flex-col",
                    "w-full sm:max-w-md",
                    "border-l border-amber-200/10",
                    "bg-gradient-to-b",
                    "from-[#241b10]",
                    "via-[#17120b]",
                    "to-[#0f1115]",
                    "shadow-2xl shadow-black/50",
                    "backdrop-blur-xl",
                    "transition-transform duration-300 ease-out",
                    open
                        ? "translate-x-0"
                        : "translate-x-full",
                ].join(" ")}
            >
                {/* Header */}
                <div
                    className="
                        shrink-0
                        border-b
                        border-white/10
                        bg-[#1b150d]/95
                        px-4
                        py-4
                        backdrop-blur-xl
                        sm:px-6
                        sm:py-5
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >
                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-3
                            "
                        >
                            <div
                                className="
                                    relative
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-amber-300/10
                                    text-amber-200
                                "
                            >
                                <Bell
                                    aria-hidden="true"
                                    size={20}
                                />

                                {unreadCount > 0 && (
                                    <span
                                        aria-hidden="true"
                                        className="
                                            absolute
                                            -right-1
                                            -top-1
                                            h-2.5
                                            w-2.5
                                            rounded-full
                                            border-2
                                            border-[#241b10]
                                            bg-emerald-400
                                            shadow-[0_0_10px_rgba(52,211,153,0.55)]
                                        "
                                    />
                                )}
                            </div>

                            <div className="min-w-0">
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <h2
                                        id="crm-notification-title"
                                        className="
                                            truncate
                                            text-lg
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        Notifications
                                    </h2>

                                    {unreadCount > 0 && (
                                        <span
                                            aria-label={`${unreadCount} unread notifications`}
                                            className="
                                                shrink-0
                                                rounded-full
                                                border
                                                border-amber-300/20
                                                bg-amber-300/10
                                                px-2
                                                py-0.5
                                                text-[10px]
                                                font-semibold
                                                text-amber-200
                                            "
                                        >
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>

                                <p
                                    id="crm-notification-description"
                                    className="
                                        mt-0.5
                                        truncate
                                        text-xs
                                        text-stone-400
                                    "
                                >
                                    Latest CRM activities
                                </p>
                            </div>
                        </div>

                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={handleClose}
                            aria-label="Close notifications"
                            title="Close notifications"
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-white/10
                                text-stone-400
                                transition
                                duration-200
                                hover:border-amber-300/30
                                hover:bg-white/10
                                hover:text-white
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-amber-300/50
                            "
                        >
                            <X
                                aria-hidden="true"
                                size={18}
                            />
                        </button>
                    </div>
                </div>

                {/* Notification list */}
                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        overscroll-contain
                        px-4
                        py-4
                        sm:px-5
                        sm:py-5
                    "
                >
                    {notifications.length === 0 ? (
                        <div
                            className="
                                flex
                                min-h-[320px]
                                flex-col
                                items-center
                                justify-center
                                px-4
                                text-center
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-white/[0.04]
                                    text-stone-500
                                "
                            >
                                <Bell
                                    aria-hidden="true"
                                    size={20}
                                />
                            </div>

                            <p
                                className="
                                    mt-4
                                    text-sm
                                    font-medium
                                    text-white
                                "
                            >
                                No notifications
                            </p>

                            <p
                                className="
                                    mt-1
                                    max-w-xs
                                    text-xs
                                    leading-relaxed
                                    text-stone-500
                                "
                            >
                                You are all caught up.
                                New CRM activity will
                                appear here.
                            </p>
                        </div>
                    ) : (
                        <div
                            className="space-y-3"
                            role="list"
                            aria-label="CRM notifications"
                        >
                            {notifications.map(
                                (item) => {
                                    const Icon =
                                        item.icon;

                                    return (
                                        <article
                                            key={item.id}
                                            role="listitem"
                                            aria-label={
                                                item.unread
                                                    ? `${item.title}, unread`
                                                    : item.title
                                            }
                                            className={[
                                                "group",
                                                "relative",
                                                "rounded-xl",
                                                "border",
                                                "p-4",
                                                "transition-all",
                                                "duration-200",
                                                item.unread
                                                    ? [
                                                          "border-amber-300/20",
                                                          "bg-amber-300/[0.055]",
                                                          "shadow-lg",
                                                          "shadow-black/10",
                                                      ].join(
                                                          " ",
                                                      )
                                                    : [
                                                          "border-white/10",
                                                          "bg-white/[0.04]",
                                                      ].join(
                                                          " ",
                                                      ),
                                                "hover:border-amber-300/30",
                                                "hover:bg-white/[0.07]",
                                            ].join(
                                                " ",
                                            )}
                                        >
                                            {item.unread && (
                                                <span
                                                    aria-hidden="true"
                                                    className="
                                                        absolute
                                                        right-3
                                                        top-3
                                                        h-2
                                                        w-2
                                                        rounded-full
                                                        bg-cyan-300
                                                        shadow-[0_0_8px_rgba(103,232,249,0.65)]
                                                    "
                                                />
                                            )}

                                            <div
                                                className="
                                                    flex
                                                    gap-3
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-amber-300/10
                                                        text-amber-200
                                                    "
                                                >
                                                    <Icon
                                                        aria-hidden="true"
                                                        size={18}
                                                    />
                                                </div>

                                                <div
                                                    className="
                                                        min-w-0
                                                        flex-1
                                                    "
                                                >
                                                    <p
                                                        className="
                                                            pr-4
                                                            text-sm
                                                            font-semibold
                                                            leading-5
                                                            text-white
                                                        "
                                                    >
                                                        {
                                                            item.title
                                                        }
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-xs
                                                            leading-5
                                                            text-stone-400
                                                        "
                                                    >
                                                        {
                                                            item.description
                                                        }
                                                    </p>

                                                    <div
                                                        className="
                                                            mt-2
                                                            flex
                                                            items-center
                                                            gap-2
                                                        "
                                                    >
                                                        <span
                                                            className="
                                                                text-[11px]
                                                                text-stone-500
                                                            "
                                                        >
                                                            {
                                                                item.time
                                                            }
                                                        </span>

                                                        {item.unread && (
                                                            <>
                                                                <span
                                                                    aria-hidden="true"
                                                                    className="
                                                                        h-1
                                                                        w-1
                                                                        rounded-full
                                                                        bg-stone-600
                                                                    "
                                                                />

                                                                <span
                                                                    className="
                                                                        text-[10px]
                                                                        font-medium
                                                                        text-cyan-300
                                                                    "
                                                                >
                                                                    New
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                },
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="
                        shrink-0
                        border-t
                        border-white/10
                        bg-[#12100d]/80
                        px-4
                        py-3
                        sm:px-5
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
                    >
                        <p
                            className="
                                text-[10px]
                                leading-4
                                text-stone-500
                            "
                        >
                            Notifications are updated
                            from CRM activity.
                        </p>

                        <span
                            className="
                                shrink-0
                                rounded-full
                                border
                                border-emerald-400/15
                                bg-emerald-400/5
                                px-2
                                py-1
                                text-[9px]
                                font-medium
                                uppercase
                                tracking-wider
                                text-emerald-300
                            "
                        >
                            Live
                        </span>
                    </div>
                </div>
            </aside>
        </>
    );
}