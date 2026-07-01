"use client";

import { useState, type ReactNode } from "react";

export interface EntityTab {
  id: string;
  label: string;
  content: ReactNode;
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
    defaultTab ?? tabs[0]?.id ?? "",
  );

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-t-md px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}