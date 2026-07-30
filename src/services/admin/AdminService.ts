import type { AdminDashboard } from "@/types/admin/Admin";

import type {
    IAdminRepository,
} from "@/repositories/admin/AdminRepository";

export class AdminService {

    constructor(
        private readonly repository: IAdminRepository,
    ) {}

    dashboard(): Promise<AdminDashboard> {

        return this.repository.dashboard();

    }

}