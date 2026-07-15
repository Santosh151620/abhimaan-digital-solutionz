"use client";

import React from "react";

type LeadFiltersProps = {
  status: string;
  onStatusChange: (status: string) => void;
  onReset: () => void;
};

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Proposal", value: "proposal" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
];

export default function LeadFilters({
  status,
  onStatusChange,
  onReset,
}: LeadFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-600">Status:</label>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onReset}
        className="px-3 py-2 text-sm border rounded-md bg-white hover:bg-gray-100"
      >
        Reset Filters
      </button>
    </div>
  );
}





