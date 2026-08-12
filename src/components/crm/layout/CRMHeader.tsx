"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Bell,
    Command,
    Palette,
    Search,
    UserCircle2,
} from "lucide-react";

import NotificationDrawer from "./NotificationDrawer";
import ProfileDrawer from "./ProfileDrawer";

export default function CRMHeader() {
    const router = useRouter();
    const pathname = usePathname();

    const [notificationsOpen, setNotificationsOpen] =
        useState(false);

    const [profileOpen, setProfileOpen] =
        useState(false);

    const [searchQuery, setSearchQuery] =
        useState("");

    const searchInputRef =
        useRef<HTMLInputElement>(null);

    const closeDrawers = useCallback(() => {
        setNotificationsOpen(false);
        setProfileOpen(false);
    }, []);

    const openNotifications = useCallback(() => {
        setProfileOpen(false);
        setNotificationsOpen(true);
    }, []);

    const openProfile = useCallback(() => {
        setNotificationsOpen(false);
        setProfileOpen(true);
    }, []);

    const closeNotifications = useCallback(() => {
        setNotificationsOpen(false);
    }, []);

    const closeProfile = useCallback(() => {
        setProfileOpen(false);
    }, []);

    const handleSearch = useCallback(() => {
        const query = searchQuery.trim();

        if (!query) {
            router.push("/crm/search");
            return;
        }

        router.push(
            `/crm/search?query=${encodeURIComponent(query)}`,
        );
    }, [router, searchQuery]);

    const handleSearchKeyDown = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleSearch();
                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();
                searchInputRef.current?.blur();
            }
        },
        [handleSearch],
    );

    useEffect(() => {
        const handleGlobalKeyDown = (
            event: globalThis.KeyboardEvent,
        ) => {
            const isSearchShortcut =
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k";

            if (isSearchShortcut) {
                event.preventDefault();

                searchInputRef.current?.focus();
                searchInputRef.current?.select();

                return;
            }

            if (
                event.key === "Escape" &&
                (notificationsOpen || profileOpen)
            ) {
                closeDrawers();
            }
        };

        window.addEventListener(
            "keydown",
            handleGlobalKeyDown,
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleGlobalKeyDown,
            );
        };
    }, [
        closeDrawers,
        notificationsOpen,
        profileOpen,
    ]);

  useEffect(() => {
    if (!pathname) {
        return;
    }

    queueMicrotask(() => {
        setNotificationsOpen(false);
        setProfileOpen(false);
    });
}, [pathname]);

    return (
        <>
            <header
                className="
                    sticky
                    top-0
                    z-40
                    border-b
                    border-amber-200/10
                    bg-gradient-to-r
                    from-[#17120b]
                    via-[#241b10]
                    to-[#0f1115]
                    shadow-lg
                    shadow-black/20
                    backdrop-blur-2xl
                "
            >
                <div
                    className="
                        relative
                        mx-auto
                        flex
                        min-h-[68px]
                        w-full
                        max-w-[1800px]
                        items-center
                        justify-between
                        gap-3
                        px-3
                        sm:gap-4
                        sm:px-4
                        md:px-5
                        lg:px-6
                        xl:px-8
                        2xl:px-10
                    "
                >
                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            inset-x-0
                            bottom-0
                            h-px
                            bg-gradient-to-r
                            from-transparent
                            via-amber-300/40
                            to-transparent
                        "
                    />

                    {/* Workspace identity */}
                    <div className="min-w-0 shrink-0">
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <div
                                aria-hidden="true"
                                className="
                                    hidden
                                    h-8
                                    w-1
                                    rounded-full
                                    bg-gradient-to-b
                                    from-amber-300
                                    via-yellow-500
                                    to-stone-400
                                    sm:block
                                "
                            />

                            <div className="min-w-0">
                                <p
                                    className="
                                        truncate
                                        text-[15px]
                                        font-semibold
                                        tracking-tight
                                        text-white
                                        sm:text-base
                                    "
                                >
                                    CRM Workspace
                                </p>

                                <p
                                    className="
                                        hidden
                                        truncate
                                        text-[10px]
                                        font-medium
                                        uppercase
                                        tracking-[0.16em]
                                        text-stone-400
                                        sm:block
                                    "
                                >
                                    Business Intelligence Workspace
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Header controls */}
                    <div
                        className="
                            ml-auto
                            flex
                            min-w-0
                            items-center
                            gap-2
                            sm:gap-2.5
                        "
                    >
                        {/* Global search */}
                        <div
                            className="
                                hidden
                                min-w-0
                                md:flex
                                md:w-[220px]
                                lg:w-[280px]
                                xl:w-[340px]
                            "
                        >
                            <form
                                role="search"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    handleSearch();
                                }}
                                className="w-full"
                            >
                                <label
                                    htmlFor="crm-global-search"
                                    className="
                                        flex
                                        h-10
                                        w-full
                                        items-center
                                        rounded-xl
                                        border
                                        border-stone-400/20
                                        bg-white/[0.04]
                                        px-3
                                        transition
                                        focus-within:border-amber-300/40
                                        focus-within:bg-white/[0.06]
                                        focus-within:shadow-lg
                                        focus-within:shadow-amber-950/10
                                    "
                                >
                                    <Search
                                        aria-hidden="true"
                                        className="
                                            mr-2.5
                                            h-4
                                            w-4
                                            shrink-0
                                            text-stone-400
                                        "
                                    />

                                    <input
                                        ref={searchInputRef}
                                        id="crm-global-search"
                                        name="query"
                                        type="search"
                                        value={searchQuery}
                                        onChange={(event) =>
                                            setSearchQuery(
                                                event.target.value,
                                            )
                                        }
                                        onKeyDown={
                                            handleSearchKeyDown
                                        }
                                        placeholder="Search CRM..."
                                        autoComplete="off"
                                        spellCheck={false}
                                        aria-label="Search CRM"
                                        className="
                                            min-w-0
                                            flex-1
                                            bg-transparent
                                            text-sm
                                            text-white
                                            outline-none
                                            placeholder:text-stone-500
                                        "
                                    />

                                    <button
                                        type="submit"
                                        aria-label="Search CRM"
                                        title="Search CRM"
                                        className="
                                            ml-2
                                            flex
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-md
                                            text-stone-500
                                            transition
                                            hover:text-amber-200
                                            focus-visible:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-amber-300/50
                                        "
                                    >
                                        <span
                                            className="
                                                hidden
                                                items-center
                                                gap-1
                                                rounded-md
                                                border
                                                border-stone-400/20
                                                bg-black/20
                                                px-1.5
                                                py-1
                                                text-[9px]
                                                text-stone-400
                                                lg:flex
                                            "
                                        >
                                            <Command
                                                aria-hidden="true"
                                                className="h-2.5 w-2.5"
                                            />
                                            K
                                        </span>
                                    </button>
                                </label>
                            </form>
                        </div>

                        {/* Mobile search */}
                        <button
                            type="button"
                            onClick={() =>
                                router.push("/crm/search")
                            }
                            aria-label="Open CRM search"
                            title="Search CRM"
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-stone-400/20
                                bg-white/[0.04]
                                text-stone-300
                                transition
                                hover:border-amber-300/40
                                hover:bg-amber-300/10
                                hover:text-amber-200
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-amber-300/50
                                md:hidden
                            "
                        >
                            <Search
                                aria-hidden="true"
                                className="h-[17px] w-[17px]"
                            />
                        </button>

                        {/* Appearance */}
                        <Link
                            href="/crm/settings/theme"
                            aria-label="Open appearance settings"
                            title="Appearance"
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-amber-200/20
                                bg-white/[0.04]
                                text-stone-300
                                transition
                                hover:border-amber-300/50
                                hover:bg-amber-300/10
                                hover:text-amber-200
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-amber-300/50
                            "
                        >
                            <Palette
                                aria-hidden="true"
                                className="h-[17px] w-[17px]"
                            />
                        </Link>

                        {/* Notifications */}
                        <button
                            type="button"
                            onClick={openNotifications}
                            aria-label={
                                notificationsOpen
                                    ? "Close notifications"
                                    : "Open notifications"
                            }
                            aria-expanded={
                                notificationsOpen
                            }
                            aria-controls="crm-notification-drawer"
                            title="Notifications"
                            className="
                                relative
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-stone-400/20
                                bg-white/[0.04]
                                text-stone-300
                                transition
                                hover:border-amber-300/40
                                hover:bg-amber-300/10
                                hover:text-amber-200
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-amber-300/50
                            "
                        >
                            <Bell
                                aria-hidden="true"
                                className="h-[17px] w-[17px]"
                            />

                            <span
                                aria-hidden="true"
                                className="
                                    absolute
                                    right-2
                                    top-2
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-amber-300
                                    shadow-[0_0_10px_rgba(251,191,36,0.8)]
                                "
                            />

                            <span className="sr-only">
                                You have unread notifications
                            </span>
                        </button>

                        {/* Administrator profile */}
                        <button
                            type="button"
                            onClick={openProfile}
                            aria-label={
                                profileOpen
                                    ? "Close administrator menu"
                                    : "Open administrator menu"
                            }
                            aria-expanded={profileOpen}
                            aria-controls="crm-profile-drawer"
                            title="Administrator"
                            className="
                                flex
                                h-10
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-amber-300/30
                                bg-gradient-to-r
                                from-amber-500/20
                                via-stone-400/10
                                to-white/5
                                px-2.5
                                text-white
                                shadow-lg
                                shadow-amber-900/20
                                transition
                                hover:border-amber-300/50
                                hover:bg-amber-500/25
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-amber-300/50
                                sm:px-3
                            "
                        >
                            <UserCircle2
                                aria-hidden="true"
                                className="
                                    h-[18px]
                                    w-[18px]
                                    shrink-0
                                    text-amber-200
                                "
                            />

                            <span
                                className="
                                    hidden
                                    text-xs
                                    font-semibold
                                    sm:block
                                "
                            >
                                Admin
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            <NotificationDrawer
                open={notificationsOpen}
                onClose={closeNotifications}
            />

            <ProfileDrawer
                open={profileOpen}
                onClose={closeProfile}
            />
        </>
    );
}