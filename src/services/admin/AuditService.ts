import type {

    AuditEntry,

    IAuditRepository,

} from "@/repositories/admin/AuditRepository";

export class AuditService {

    constructor(

        private readonly repository: IAuditRepository

    ) {}

    log(

        entry: AuditEntry

    ): Promise<void> {

        return this.repository.log(entry);

    }

}