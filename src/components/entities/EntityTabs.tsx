"use client";

import { useState } from "react";

export interface EntityTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface EntityTabsProps {
  tabs: EntityTab[];
  defaultTab?: string;
}

export default function EntityTabs({
  tabs,
  defaultTab,
}: EntityTabsProps) {
  const [activeTab, setActiveTab] = useState(
    defaultTab ?? tabs[0]?.id ?? ""
  );

  const active =
    tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={[
              "rounded-t-lg px-4 py-2 text-sm font-medium transition",
              activeTab === tab.id
                ? "border-b-2 border-cyan-500 text-cyan-400"
                : "text-slate-400 hover:text-white",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{active?.content}</div>
    </div>
  );
}