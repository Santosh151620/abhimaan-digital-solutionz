import type {
    Department,
} from "@/types/admin/Department";

import type {
    IDepartmentsRepository,
} from "@/repositories/admin/DepartmentsRepository";

export class DepartmentsService {

    constructor(
        private readonly repository:
            IDepartmentsRepository,
    ) {}

    async list():
        Promise<Department[]> {

        return this.repository.list();
    }

    async active():
        Promise<Department[]> {

        return this.repository.active();
    }

    async findById(
        id:string,
    ):
        Promise<Department | null> {

        this.validateId(
            id,
        );

        return this.repository.findById(
            id,
        );
    }

    async findByCode(
        code:string,
    ):
        Promise<Department | null> {

        if(!code?.trim()) {

            throw new Error(
                "Department code is required.",
            );

        }

        return this.repository.findByCode(
            code
                .trim()
                .toUpperCase(),
        );
    }

    async save(
        department:Department,
    ):
        Promise<void> {

        this.validateDepartment(
            department,
        );

        const existing =
            await this.repository.findByCode(
                department.departmentCode,
            );

        if(
            existing &&
            existing.id !== department.id
        ) {

            throw new Error(
                "Department code already exists.",
            );

        }

        await this.repository.save({

            ...department,

            departmentCode:
                department.departmentCode
                    .trim()
                    .toUpperCase(),

            departmentName:
                department.departmentName
                    .trim(),

            updatedAt:
                new Date()
                    .toISOString(),

        });
    }

    async delete(
        id:string,
    ):
        Promise<void> {

        this.validateId(
            id,
        );

        const department =
            await this.repository.findById(
                id,
            );

        if(!department) {

            throw new Error(
                "Department not found.",
            );

        }

        await this.repository.delete(
            id,
        );
    }

    private validateDepartment(
        department:Department,
    ) {

        if(
            !department.departmentCode?.trim()
        ) {

            throw new Error(
                "Department code is required.",
            );

        }

        if(
            !department.departmentName?.trim()
        ) {

            throw new Error(
                "Department name is required.",
            );

        }

        if(
            !department.organizationId?.trim()
        ) {

            throw new Error(
                "Organization is required.",
            );

        }

        if(
            !department.status
        ) {

            throw new Error(
                "Department status is required.",
            );

        }
    }

    private validateId(
        id:string,
    ) {

        if(!id?.trim()) {

            throw new Error(
                "Department id is required.",
            );

        }
    }
}