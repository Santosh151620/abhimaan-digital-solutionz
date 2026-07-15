import type { ProjectStatus } from "@/modules/projects/types/project";

export const PROJECT_STATUS_PIPELINE: {
  key: ProjectStatus;
  label: string;
  color: string;
  order: number;
}[] = [
  {
    key: "planning",
    label: "Planning",
    color: "gray",
    order: 1,
  },
  {
    key: "active",
    label: "Active",
    color: "blue",
    order: 2,
  },
  {
    key: "on_hold",
    label: "On Hold",
    color: "yellow",
    order: 3,
  },
  {
    key: "completed",
    label: "Completed",
    color: "green",
    order: 4,
  },
  {
    key: "cancelled",
    label: "Cancelled",
    color: "red",
    order: 5,
  },
];

export const getNextStatus = (current: ProjectStatus): ProjectStatus | null => {
  const sorted = [...PROJECT_STATUS_PIPELINE].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((s) => s.key === current);
  if (index === -1 || index === sorted.length - 1) return null;
  return sorted[index + 1].key;
};

export const getPreviousStatus = (current: ProjectStatus): ProjectStatus | null => {
  const sorted = [...PROJECT_STATUS_PIPELINE].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((s) => s.key === current);
  if (index <= 0) return null;
  return sorted[index - 1].key;
};





