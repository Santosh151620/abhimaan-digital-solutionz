import type { AdminDashboard } from "@/types/admin/Admin";

export interface IAdminRepository {

    dashboard(): Promise<AdminDashboard>;

}