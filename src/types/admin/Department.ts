export interface Department {
    id: string;

    organizationId: string;

    departmentCode: string;

    departmentName: string;

    parentDepartmentId?: string;

    managerId?: string;

    status: "Active" | "Inactive";

    metadata: Record<string, unknown>;

    createdAt: string;

    updatedAt: string;
}