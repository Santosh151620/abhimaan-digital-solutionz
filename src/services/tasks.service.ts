import type { Task } from "@/types/crm/Tasks";
import { TasksRepository } from "@/repositories/tasks.repository";

export class TasksService {
  constructor(
    private readonly repository: TasksRepository,
  ) {}

  getByEntity(
    entityType: string,
    entityId: string,
  ): Promise<Task[]> {
    return this.repository.findByEntity(
      entityType,
      entityId,
    );
  }

  create(
    task: Partial<Task>,
  ): Promise<Task> {
    return this.repository.create(task);
  }
}






