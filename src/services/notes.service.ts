import type { Note } from "@/types/crm/Notes";
import { NotesRepository } from "@/repositories/crm/NotesRepository";

export class NotesService {
  constructor(
    private readonly repository: NotesRepository,
  ) {}

  getByEntity(
    entityType: string,
    entityId: string,
  ): Promise<Note[]> {
    return this.repository.findByEntity(
      entityType,
      entityId,
    );
  }

  create(
    note: Partial<Note>,
  ): Promise<Note> {
    return this.repository.create(note);
  }
}









