"use client";

import Link from "next/link";
import {
    useCallback,
    useEffect,
    useRef,
} from "react";
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

type MenuItem = {
    icon: typeof User;
    title: string;
    description: string;
    href?: string;
    action?: "language" | "logout";
};

const menu: MenuItem[] = [
    {
        icon: User,
        title: "My Profile",
        description: "View and manage your profile",
        href: "/crm/profile",
    },
    {
        icon: Settings,
        title: "Settings",
        description: "Manage workspace preferences",
        href: "/crm/settings",
    },
    {
        icon: Palette,
        title: "Change Theme",
        description: "Customize your workspace appearance",
        href: "/crm/settings/theme",
    },
    {
        icon: Globe,
        title: "Change Language",
        description: "Choose your preferred language",
        action: "language",
    },
    {
        icon: Shield,
        title: "Security",
        description: "Review account and security settings",
        href: "/crm/security",
    },
    {
        icon: LogOut,
        title: "Log Out",
        description: "Sign out of your CRM session",
        action: "logout",
    },
];

function getInitial(name: string): string {
    const trimmed = name.trim();

    return trimmed.length > 0
        ? trimmed.charAt(0).toUpperCase()
        : "A";
}

export default function ProfileDrawer({
    open,
    onClose,
}: Props) {
    const closeButtonRef =
        useRef<HTMLButtonElement | null>(null);

    const previouslyFocusedElementRef =
        useRef<HTMLElement | null>(null);

    const handleAction = useCallback(
        (action: MenuItem["action"]) => {
            switch (action) {
                case "language":
                    /*
                     * Locale switching remains owned by
                     * next-intl/application routing.
                     *
                     * Do not introduce a second locale manager
                     * inside this presentation component.
                     */
                    return;

                case "logout":
                    /*
                     * Authentication/logout remains owned by
                     * the existing Supabase/Auth flow.
                     *
                     * Do not duplicate authentication logic here.
                     */
                    return;

                default:
                    return;
            }
        },
        [],
    );

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

        const focusTimer =
            window.setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 50);

        const handleKeyDown = (
            event: globalThis.KeyboardEvent,
        ) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );

            window.clearTimeout(focusTimer);

            previouslyFocusedElementRef.current?.focus();
            previouslyFocusedElementRef.current = null;
        };
    }, [open, onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                aria-hidden="true"
                onClick={open ? onClose : undefined}
                className={[
                    "fixed",
                    "inset-0",
                    "z-40",
                    "bg-black/50",
                    "backdrop-blur-sm",
                    "transition-opacity",
                    "duration-300",
                    open
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0",
                ].join(" ")}
            />

            {/* Drawer */}
            <aside
                id="crm-profile-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby="crm-profile-drawer-title"
                aria-hidden={!open}
                className={[
                    "fixed",
                    "right-0",
                    "top-0",
                    "z-50",
                    "flex",
                    "h-dvh",
                    "w-full",
                    "max-w-md",
                    "flex-col",
                    "border-l",
                    "border-white/10",
                    "bg-slate-950/95",
                    "shadow-2xl",
                    "shadow-black/40",
                    "backdrop-blur-xl",
                    "transition-transform",
                    "duration-300",
                    "ease-out",
                    open
                        ? "translate-x-0"
                        : "translate-x-full",
                ].join(" ")}
            >
                {/* Header */}
                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-white/10
                        px-5
                        py-5
                        sm:px-6
                    "
                >
                    <div className="min-w-0">
                        <h2
                            id="crm-profile-drawer-title"
                            className="
                                truncate
                                text-lg
                                font-semibold
                                text-white
                            "
                        >
                            Administrator
                        </h2>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-slate-500
                            "
                        >
                            Account & workspace
                        </p>
                    </div>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close administrator menu"
                        title="Close"
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
                            text-slate-400
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

                {/* Profile Summary */}
                <div
                    className="
                        shrink-0
                        border-b
                        border-white/10
                        px-6
                        py-7
                        text-center
                    "
                >
                    <div
                        className="
                            relative
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
                            shadow-blue-950/40
                        "
                        aria-hidden="true"
                    >
                        {getInitial("Administrator")}

                        <span
                            className="
                                absolute
                                bottom-1
                                right-1
                                h-4
                                w-4
                                rounded-full
                                border-2
                                border-slate-950
                                bg-emerald-400
                                shadow-[0_0_10px_rgba(52,211,153,0.55)]
                            "
                        />
                    </div>

                    <h3
                        className="
                            mt-4
                            text-xl
                            font-semibold
                            text-white
                        "
                    >
                        Administrator
                    </h3>

                    <div
                        className="
                            mt-1.5
                            inline-flex
                            items-center
                            gap-1.5
                            text-sm
                            text-emerald-400
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-emerald-400
                            "
                        />

                        Online
                    </div>
                </div>

                {/* Menu */}
                <nav
                    aria-label="Administrator account menu"
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        overscroll-contain
                        px-4
                        py-5
                        sm:px-5
                    "
                >
                    <div className="space-y-2">
                        {menu.map((item) => {
                            const Icon = item.icon;

                            const content = (
                                <>
                                    <span
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-white/[0.04]
                                            text-slate-400
                                            transition
                                            duration-150
                                            group-hover:bg-amber-300/10
                                            group-hover:text-amber-200
                                        "
                                    >
                                        <Icon
                                            aria-hidden="true"
                                            size={18}
                                        />
                                    </span>

                                    <span
                                        className="
                                            min-w-0
                                            flex-1
                                        "
                                    >
                                        <span
                                            className="
                                                block
                                                truncate
                                                text-sm
                                                font-medium
                                                text-slate-200
                                                group-hover:text-white
                                            "
                                        >
                                            {item.title}
                                        </span>

                                        <span
                                            className="
                                                mt-0.5
                                                block
                                                truncate
                                                text-xs
                                                text-slate-500
                                                group-hover:text-slate-400
                                            "
                                        >
                                            {item.description}
                                        </span>
                                    </span>
                                </>
                            );

                            const className = [
                                "group",
                                "flex",
                                "w-full",
                                "items-center",
                                "gap-3",
                                "rounded-xl",
                                "border",
                                "border-transparent",
                                "px-3",
                                "py-3",
                                "text-left",
                                "transition-all",
                                "duration-150",
                                "hover:border-white/10",
                                "hover:bg-white/[0.06]",
                                "focus-visible:outline-none",
                                "focus-visible:ring-2",
                                "focus-visible:ring-amber-300/50",
                            ].join(" ");

                            if (item.href) {
                                return (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        onClick={onClose}
                                        className={className}
                                    >
                                        {content}
                                    </Link>
                                );
                            }

                            return (
                                <button
                                    key={item.title}
                                    type="button"
                                    onClick={() =>
                                        handleAction(
                                            item.action,
                                        )
                                    }
                                    className={className}
                                >
                                    {content}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div
                    className="
                        shrink-0
                        border-t
                        border-white/10
                        bg-black/10
                        px-5
                        py-4
                    "
                >
                    <p
                        className="
                            text-center
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.18em]
                            text-slate-600
                        "
                    >
                        CRM Workspace
                    </p>
                </div>
            </aside>
        </>
    );
}