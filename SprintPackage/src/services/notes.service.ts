import type { Note } from "@/types/notes";
import { NotesRepository } from "@/repositories/notes.repository";

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
