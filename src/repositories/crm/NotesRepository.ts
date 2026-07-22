import {
    NotesRepository as BaseNotesRepository,
} from '@/repositories/notes.repository';

import type {
    SupabaseClient,
} from '@supabase/supabase-js';

export class NotesRepository extends BaseNotesRepository {

    constructor(
        supabase: SupabaseClient,
    ) {
        super(supabase);
    }

}