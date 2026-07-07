import type {
  ActivityFilter,
  ActivityItem,
  CreateActivityInput,
} from "../types/activity";

export interface ActivityProvider {
  list(filter: ActivityFilter): Promise<ActivityItem[]>;

  create?(input: CreateActivityInput): Promise<ActivityItem>;
}

export class ActivityService {
  constructor(private readonly provider: ActivityProvider) {}

  async list(filter: ActivityFilter = {}): Promise<ActivityItem[]> {
    return this.provider.list(filter);
  }

  async create(input: CreateActivityInput): Promise<ActivityItem> {
    if (!this.provider.create) {
      throw new Error("Activity provider does not support create().");
    }

    return this.provider.create({
      ...input,
      title: input.title.trim(),
      description: input.description?.trim() ?? null,
      metadata: input.metadata ?? {},
    });
  }
}