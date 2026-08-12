"use client";

import {
    BookOpen,
    HelpCircle,
    LifeBuoy,
    Search,
    X,
} from "lucide-react";
import {
    useEffect,
    useId,
    useRef,
} from "react";

interface Props {
    onClick?: () => void;
}

interface HelpPanelProps {
    open?: boolean;
    onClose?: () => void;
}

interface HelpItem {
    icon: typeof Search;
    label: string;
    description: string;
}

const helpItems: HelpItem[] = [
    {
        icon: Search,
        label: "Search Knowledge Base",
        description:
            "Find answers and product guidance",
    },
    {
        icon: BookOpen,
        label: "Documentation",
        description:
            "Browse CRM documentation and guides",
    },
    {
        icon: LifeBuoy,
        label: "Raise Support Ticket",
        description:
            "Contact support for assistance",
    },
];

export default function HelpCenter({
    onClick,
}: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="Open help center"
            title="Help Center"
            className="
                fixed
                bottom-5
                right-5
                z-40
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                border
                border-amber-300/30
                bg-gradient-to-br
                from-amber-400
                via-yellow-500
                to-stone-500
                text-[#17120b]
                shadow-2xl
                shadow-amber-900/30
                transition-all
                duration-200
                hover:scale-105
                hover:brightness-110
                active:scale-95
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-amber-300/70
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#0f1115]
                sm:bottom-6
                sm:right-6
            "
        >
            <HelpCircle
                aria-hidden="true"
                className="h-7 w-7"
            />
        </button>
    );
}

function HelpPanel({
    open = true,
    onClose,
}: HelpPanelProps) {
    const titleId = useId();

    const closeButtonRef =
        useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

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
                onClose?.();
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
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close help center"
                onClick={onClose}
                className="
                    fixed
                    inset-0
                    z-40
                    cursor-default
                    border-0
                    bg-black/40
                    p-0
                    backdrop-blur-sm
                "
            />

            {/* Panel */}
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="
                    fixed
                    bottom-24
                    right-5
                    z-50
                    w-[calc(100vw-2.5rem)]
                    max-w-sm
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-gradient-to-b
                    from-[#241b10]
                    via-[#17120b]
                    to-[#0f1115]
                    text-white
                    shadow-2xl
                    shadow-black/50
                    sm:right-6
                "
            >
                {/* Header */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-white/10
                        px-5
                        py-4
                    "
                >
                    <div className="min-w-0">
                        <h2
                            id={titleId}
                            className="
                                text-lg
                                font-bold
                                text-white
                            "
                        >
                            Help Center
                        </h2>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-stone-500
                            "
                        >
                            Find help and CRM guidance
                        </p>
                    </div>

                    {onClose && (
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={onClose}
                            aria-label="Close help center"
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
                                text-stone-400
                                transition
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
                                className="h-4 w-4"
                            />
                        </button>
                    )}
                </div>

                {/* Help Options */}
                <div className="space-y-2 p-4">
                    {helpItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.label}
                                type="button"
                                className="
                                    group
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-transparent
                                    p-3
                                    text-left
                                    transition-all
                                    duration-150
                                    hover:border-amber-300/20
                                    hover:bg-white/[0.06]
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-amber-300/50
                                "
                            >
                                <span
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-amber-300/10
                                        text-amber-200
                                        transition
                                        group-hover:bg-amber-300/15
                                    "
                                >
                                    <Icon
                                        aria-hidden="true"
                                        className="h-5 w-5"
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
                                            text-stone-200
                                            group-hover:text-white
                                        "
                                    >
                                        {item.label}
                                    </span>

                                    <span
                                        className="
                                            mt-0.5
                                            block
                                            truncate
                                            text-xs
                                            text-stone-500
                                            group-hover:text-stone-400
                                        "
                                    >
                                        {item.description}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div
                    className="
                        border-t
                        border-white/10
                        px-5
                        py-3
                    "
                >
                    <p
                        className="
                            text-center
                            text-[10px]
                            leading-4
                            text-stone-600
                        "
                    >
                        Need more assistance? Contact
                        your organization administrator.
                    </p>
                </div>
            </section>
        </>
    );
}