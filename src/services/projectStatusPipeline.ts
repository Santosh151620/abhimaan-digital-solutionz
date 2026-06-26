import { ProjectStatus } from "@/types/project";

export const PROJECT_STATUS_PIPELINE: {
  key: ProjectStatus;
  label: string;
  color: string;
  order: number;
}[] = [
  {
    key: "PLANNING",
    label: "Planning",
    color: "gray",
    order: 1,
  },
  {
    key: "IN_PROGRESS",
    label: "In Progress",
    color: "blue",
    order: 2,
  },
  {
    key: "ON_HOLD",
    label: "On Hold",
    color: "yellow",
    order: 3,
  },
  {
    key: "COMPLETED",
    label: "Completed",
    color: "green",
    order: 4,
  },
  {
    key: "CANCELLED",
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