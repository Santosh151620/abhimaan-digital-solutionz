"use client";

import { memo, useMemo, useState } from "react";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

export interface LeadTableItem {
  id: string;
  created_at: string;

  full_name: string | null;
  email: string | null;
  phone: string | null;

  company: string | null;

  service_interest: string | null;

  source: string | null;

  status: LeadStatus;

  client_id: string | null;
}

interface LeadTableProps {
  leads: LeadTableItem[];

  loading?: boolean;

  onOpenLead: (lead: LeadTableItem) => void;

  onConvertLead: (lead: LeadTableItem) => void;
}

const STATUS_OPTIONS: Array<{
  value: "all" | LeadStatus;
  label: string;
}> = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "new",
    label: "New",
  },
  {
    value: "contacted",
    label: "Contacted",
  },
  {
    value: "qualified",
    label: "Qualified",
  },
  {
    value: "proposal",
    label: "Proposal",
  },
  {
    value: "won",
    label: "Won",
  },
  {
    value: "lost",
    label: "Lost",
  },
];

function getStatusClasses(status: LeadStatus): string {
  switch (status) {
    case "new":
      return "bg-sky-500/20 text-sky-300 border border-sky-500/30";

    case "contacted":
      return "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30";

    case "qualified":
      return "bg-purple-500/20 text-purple-300 border border-purple-500/30";

    case "proposal":
      return "bg-amber-500/20 text-amber-300 border border-amber-500/30";

    case "won":
      return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";

    case "lost":
      return "bg-rose-500/20 text-rose-300 border border-rose-500/30";

    default:
      return "bg-slate-700 text-slate-200";
  }
}

const PAGE_SIZE = 10;

function LeadTable({
  leads,
  loading = false,
  onOpenLead,
  onConvertLead,
}: LeadTableProps) {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | LeadStatus
  >("all");

  const [page, setPage] = useState(1);

  const filteredLeads = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        keyword.length === 0 ||
        lead.full_name?.toLowerCase().includes(keyword) ||
        lead.email?.toLowerCase().includes(keyword) ||
        lead.company?.toLowerCase().includes(keyword) ||
        lead.phone?.toLowerCase().includes(keyword) ||
        lead.service_interest?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLeads.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredLeads.slice(start, start + PAGE_SIZE);
  }, [filteredLeads, currentPage]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (
    value: "all" | LeadStatus
  ) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="border-b border-white/10 p-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-xl font-semibold text-white">
              Leads
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Search, filter and manage incoming enquiries.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search leads..."
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none transition focus:border-cyan-500 md:w-72"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value as "all" | LeadStatus
                )
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none"
            >
              {STATUS_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

          </div>

        </div>

      </div>

            <div className="overflow-x-auto">
        <table className="min-w-full">

          <thead className="border-b border-white/10 bg-slate-900/70">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">

              <th className="px-5 py-4 font-medium">
                Lead
              </th>

              <th className="px-5 py-4 font-medium">
                Company
              </th>

              <th className="px-5 py-4 font-medium">
                Service
              </th>

              <th className="px-5 py-4 font-medium">
                Status
              </th>

              <th className="px-5 py-4 font-medium">
                Source
              </th>

              <th className="px-5 py-4 font-medium">
                Created
              </th>

              <th className="px-5 py-4 text-right font-medium">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-16 text-center text-slate-400"
                >
                  Loading leads...
                </td>
              </tr>
            )}

            {!loading && filteredLeads.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-16 text-center text-slate-400"
                >
                  No leads found.
                </td>
              </tr>
            )}

            {!loading &&
              paginatedLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-white/5 transition hover:bg-white/5"
                >
                  <td className="px-5 py-4 align-top">

                    <div className="font-medium text-white">
                      {lead.full_name || "-"}
                    </div>

                    <div className="mt-1 text-sm text-slate-400">
                      {lead.email || "-"}
                    </div>

                    {lead.phone && (
                      <div className="mt-1 text-xs text-slate-500">
                        {lead.phone}
                      </div>
                    )}

                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {lead.company || "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {lead.service_interest || "-"}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>

                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {lead.source || "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {lead.created_at.split("T")[0]}
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      <button
                        type="button"
                        onClick={() => onOpenLead(lead)}
                        className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
                      >
                        Open
                      </button>

                      {!lead.client_id && (
                        <button
                          type="button"
                          onClick={() => onConvertLead(lead)}
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                        >
                          Convert
                        </button>
                      )}

                      {lead.client_id && (
                        <span className="rounded-lg bg-emerald-500/20 px-3 py-2 text-sm font-medium text-emerald-300 border border-emerald-500/30">
                          Client
                        </span>
                      )}

                    </div>

                  </td>

                </tr>
              ))}

          </tbody>

        </table>

      </div>

          <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">

        <div className="text-sm text-slate-400">
          Showing{" "}
          <span className="font-medium text-white">
            {filteredLeads.length === 0
              ? 0
              : (currentPage - 1) * PAGE_SIZE + 1}
          </span>
          {" "}to{" "}
          <span className="font-medium text-white">
            {Math.min(
              currentPage * PAGE_SIZE,
              filteredLeads.length
            )}
          </span>
          {" "}of{" "}
          <span className="font-medium text-white">
            {filteredLeads.length}
          </span>{" "}
          lead{filteredLeads.length === 1 ? "" : "s"}
        </div>

        <div className="flex items-center justify-end gap-2">

          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() =>
              setPage((previous) => Math.max(previous - 1, 1))
            }
            className="rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <div className="rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-slate-300">
            Page{" "}
            <span className="font-semibold text-white">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-white">
              {totalPages}
            </span>
          </div>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() =>
              setPage((previous) =>
                Math.min(previous + 1, totalPages)
              )
            }
            className="rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}

export default memo(LeadTable);
