import type { AdminDashboard } from "@/types/admin/Admin";

import { AdminRepository } from "@/repositories/admin/AdminRepository";

export class AdminService {

    constructor(
        private readonly repository: AdminRepository,
    ) {}

    async dashboard(): Promise<AdminDashboard> {

        return this.repository.dashboard();

    }

}
