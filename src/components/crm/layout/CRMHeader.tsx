"use client";

import { useState } from "react";
import {
    Bell,
    UserCircle2,
    Palette,
    Search,
    Command,
} from "lucide-react";

import NotificationDrawer from "./NotificationDrawer";
import ProfileDrawer from "./ProfileDrawer";

export default function CRMHeader() {

    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const [profileOpen, setProfileOpen] = useState(false);

    return (

        <>

            <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(10,16,32,.75)] backdrop-blur-xl">

                <div className="flex h-16 items-center justify-between px-8">

                    <div>

                        <h1 className="text-lg font-semibold text-white tracking-wide">

                            Abhimaan CRM

                        </h1>

                        <p className="text-xs text-slate-400">

                            Enterprise Business Suite

                        </p>

                    </div>

                    <div className="flex items-center gap-3">

                        <div className="hidden lg:flex items-center rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2">

                            <Search
                                size={16}
                                className="mr-2 text-slate-400"
                            />

                            <input
                                placeholder="Search..."
                                className="bg-transparent text-sm outline-none placeholder:text-slate-500 text-white"
                            />

                            <div className="ml-4 flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-400">

                                <Command size={12}/>

                                K

                            </div>

                        </div>

                        <button

                            className="rounded-xl border border-white/10 bg-slate-900/70 p-2 text-slate-300 transition hover:scale-105 hover:border-cyan-400"

                        >

                            <Palette size={18}/>

                        </button>

                        <button

                            onClick={() => setNotificationsOpen(true)}

                            className="rounded-xl border border-white/10 bg-slate-900/70 p-2 text-slate-300 transition hover:scale-105 hover:border-cyan-400"

                        >

                            <Bell size={18}/>

                        </button>

                        <button

                            onClick={() => setProfileOpen(true)}

                            className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-600 to-blue-700 px-3 py-2 text-white transition hover:scale-[1.03]"

                        >

                            <UserCircle2 size={20}/>

                            Admin

                        </button>

                    </div>

                </div>

            </header>

            <NotificationDrawer

                open={notificationsOpen}

                onClose={() => setNotificationsOpen(false)}

            />

            <ProfileDrawer

                open={profileOpen}

                onClose={() => setProfileOpen(false)}

            />

        </>

    );

}