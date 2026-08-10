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
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-slate-950/80 shadow-lg shadow-black/10 backdrop-blur-2xl">
        <div className="relative mx-auto flex min-h-[68px] w-full max-w-[1800px] items-center justify-between gap-4 px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 2xl:px-10">
          {/* Subtle header accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
          />

          {/* Workspace identity */}
          <div className="min-w-0 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="hidden h-8 w-1 rounded-full bg-gradient-to-b from-cyan-300 to-blue-600 sm:block" />

              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold tracking-tight text-white sm:text-base">
                  CRM Workspace
                </p>

                <p className="hidden truncate text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500 sm:block">
                  Business Intelligence Workspace
                </p>
              </div>
            </div>
          </div>

          {/* Header controls */}
          <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-2.5">
            {/* Global search */}
            <div className="hidden min-w-0 md:flex md:w-[220px] lg:w-[280px] xl:w-[340px]">
              <label
                htmlFor="crm-global-search"
                className="flex h-10 w-full items-center rounded-xl border border-white/[0.09] bg-white/[0.035] px-3 transition-all duration-200 focus-within:border-cyan-400/30 focus-within:bg-white/[0.055] focus-within:shadow-lg focus-within:shadow-cyan-950/20"
              >
                <Search
                  aria-hidden="true"
                  className="mr-2.5 h-4 w-4 shrink-0 text-slate-500"
                />

                <input
                  id="crm-global-search"
                  type="search"
                  placeholder="Search CRM..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />

                <span className="ml-2 hidden shrink-0 items-center gap-1 rounded-md border border-white/[0.08] bg-slate-900/80 px-1.5 py-1 text-[9px] font-medium text-slate-500 lg:flex">
                  <Command
                    aria-hidden="true"
                    className="h-2.5 w-2.5"
                  />
                  K
                </span>
              </label>
            </div>

            {/* Compact mobile search */}
            <button
              type="button"
              aria-label="Search CRM"
              title="Search CRM"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035] text-slate-400 transition-all hover:border-cyan-400/25 hover:bg-white/[0.06] hover:text-white md:hidden"
            >
              <Search className="h-[17px] w-[17px]" />
            </button>

            {/* Appearance */}
            <button
              type="button"
              aria-label="Appearance settings"
              title="Appearance"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035] text-slate-400 transition-all duration-200 hover:border-cyan-400/25 hover:bg-white/[0.06] hover:text-cyan-200"
            >
              <Palette className="h-[17px] w-[17px]" />
            </button>

            {/* Notifications */}
            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              aria-label="Open notifications"
              title="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035] text-slate-400 transition-all duration-200 hover:border-cyan-400/25 hover:bg-white/[0.06] hover:text-cyan-200"
            >
              <Bell className="h-[17px] w-[17px]" />

              <span
                aria-hidden="true"
                className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.7)]"
              />
            </button>

            {/* Profile */}
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              aria-label="Open administrator profile"
              title="Administrator profile"
              className="flex h-10 items-center gap-2 rounded-xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-indigo-500/15 px-2.5 text-white shadow-lg shadow-cyan-950/10 transition-all duration-200 hover:border-cyan-300/35 hover:bg-cyan-400/15 sm:px-3"
            >
              <UserCircle2 className="h-[18px] w-[18px] shrink-0 text-cyan-200" />

              <span className="hidden text-xs font-semibold sm:block">
                Admin
              </span>

              <span className="hidden h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.7)] lg:block" />
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
