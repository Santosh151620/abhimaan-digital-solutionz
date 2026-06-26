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
      href: "#",
    },
    {
      label: "Settings",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex">
        <aside className="hidden md:flex md:w-72 md:flex-col border-r border-slate-800 bg-black/40 backdrop-blur-xl">
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-2xl font-bold">
              Abhimaan Digital
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Admin CRM
            </p>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const active =
                pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl transition ${
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

        <div className="flex-1 min-w-0">
          <header className="h-16 border-b border-slate-800 bg-black/30 backdrop-blur-xl flex items-center justify-between px-6">
            <div>
              <h2 className="font-semibold">
                CRM Dashboard
              </h2>
            </div>

            <div className="text-sm text-slate-400">
              Abhimaan Digital Solutionz
            </div>
          </header>

          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}