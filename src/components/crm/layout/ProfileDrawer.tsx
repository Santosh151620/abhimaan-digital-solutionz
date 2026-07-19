"use client";

import {
  User,
  Palette,
  Globe,
  Shield,
  LogOut,
  Settings,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const menu = [
  {
    icon: User,
    title: "My Profile",
  },
  {
    icon: Palette,
    title: "Appearance",
  },
  {
    icon: Globe,
    title: "Language",
  },
  {
    icon: Shield,
    title: "Security",
  },
  {
    icon: Settings,
    title: "Preferences",
  },
  {
    icon: LogOut,
    title: "Logout",
  },
];

export default function ProfileDrawer({
  open,
  onClose,
}: Props) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-96 bg-white shadow-2xl transition-all duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-b p-8 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
            A
          </div>

          <h2 className="mt-4 text-xl font-bold">
            Administrator
          </h2>

          <p className="text-sm text-emerald-600">
            ● Online
          </p>
        </div>

        <div className="p-5 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                className="flex w-full items-center gap-4 rounded-xl p-4 transition hover:bg-slate-100"
              >
                <Icon size={20} />

                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}