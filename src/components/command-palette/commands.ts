"use client";

import type { CommandAction } from "./types";

export const commandRegistry: CommandAction[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    subtitle: "Executive overview",
    group: "Navigation",
    shortcut: "G D",
    run: () => {
      window.location.href = "/en/dashboard";
    },
  },
  {
    id: "leads",
    title: "Leads",
    subtitle: "Lead Management",
    group: "Navigation",
    shortcut: "G L",
    run: () => {
      window.location.href = "/en/dashboard/leads";
    },
  },
  {
    id: "clients",
    title: "Clients",
    subtitle: "Client Workspace",
    group: "Navigation",
    shortcut: "G C",
    run: () => {
      window.location.href = "/en/dashboard/clients";
    },
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "Project Workspace",
    group: "Navigation",
    shortcut: "G P",
    run: () => {
      window.location.href = "/en/dashboard/projects";
    },
  },
  {
    id: "payments",
    title: "Payments",
    subtitle: "Revenue & Payments",
    group: "Navigation",
    shortcut: "G M",
    run: () => {
      window.location.href = "/en/dashboard/payments";
    },
  },
  {
    id: "analytics",
    title: "Analytics",
    subtitle: "Business Intelligence",
    group: "Navigation",
    shortcut: "G A",
    run: () => {
      window.location.href = "/en/dashboard/analytics";
    },
  },
  {
    id: "email",
    title: "Email Center",
    subtitle: "CRM Mail",
    group: "Navigation",
    shortcut: "G E",
    run: () => {
      window.location.href = "/en/dashboard/email";
    },
  },
];