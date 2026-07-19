"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/en/dashboard",
    },
    {
      label: "Leads",
      href: "/en/dashboard/leads",
    },
    {
      label: "Reports",
      href: "/en/dashboard/reports",
    },
    {
      label: "Settings",
      href: "/en/dashboard/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex">
        <aside className="hidden md:flex md:w-72 md:flex-col border-r border-slate-800 bg-black/40 backdrop-blur-xl">
          <div className="border-b border-slate-800 p-6">
            <h1 className="text-2xl font-bold">
              Abhimaan Digital Solutionz
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Customer Portal
            </p>
          </div>

          <nav className="space-y-2 p-4">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 transition ${
                    active
                      ? "bg-cyan-600 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-black/30 px-6 backdrop-blur-xl">
            <h2 className="font-semibold">
              Customer Workspace
            </h2>

            <span className="text-sm text-slate-400">
              Website
            </span>
          </header>

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}