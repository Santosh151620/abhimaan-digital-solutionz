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

        id: string,

    ):

    Promise<Department | null> {

        const normalizedId =
            this.validateId(
                id,
            );


        return this.repository.findById(

            normalizedId,

        );

    }


    async findByCode(

        code: string,

    ):

    Promise<Department | null> {

        const normalizedCode =
            this.normalizeCode(
                code,
            );


        return this.repository.findByCode(

            normalizedCode,

        );

    }


    async save(

        department: Department,

    ):

    Promise<void> {

        const normalizedDepartment =
            this.validateDepartment(
                department,
            );


        const existing =
            await this.repository.findByCode(

                normalizedDepartment
                    .departmentCode,

            );


        if (

            existing &&

            existing.id !==
                department.id

        ) {

            throw new Error(

                "Department code already exists.",

            );

        }


        await this.repository.save(

            {

                ...department,

                departmentCode:
                    normalizedDepartment
                        .departmentCode,

                departmentName:
                    normalizedDepartment
                        .departmentName,

                updatedAt:
                    new Date()
                        .toISOString(),

            },

        );

    }


    async delete(

        id: string,

    ):

    Promise<void> {

        const normalizedId =
            this.validateId(
                id,
            );


        const department =
            await this.repository.findById(

                normalizedId,

            );


        if (!department) {

            throw new Error(

                "Department not found.",

            );

        }


        await this.repository.delete(

            normalizedId,

        );

    }


    private validateDepartment(

        department: Department,

    ): {

        departmentCode: string;

        departmentName: string;

    } {

        if (!department) {

            throw new Error(

                "Department is required.",

            );

        }


        const departmentCode =
            typeof department.departmentCode ===
            "string"
                ? department.departmentCode
                    .trim()
                    .toUpperCase()
                : "";


        const departmentName =
            typeof department.departmentName ===
            "string"
                ? department.departmentName.trim()
                : "";


        if (!departmentCode) {

            throw new Error(

                "Department code is required.",

            );

        }


        if (!departmentName) {

            throw new Error(

                "Department name is required.",

            );

        }


        if (
            !department.organizationId?.trim()
        ) {

            throw new Error(

                "Organization is required.",

            );

        }


        if (!department.status) {

            throw new Error(

                "Department status is required.",

            );

        }


        return {

            departmentCode,

            departmentName,

        };

    }


    private normalizeCode(

        code: string,

    ): string {

        const normalizedCode =
            typeof code === "string"
                ? code.trim().toUpperCase()
                : "";


        if (!normalizedCode) {

            throw new Error(

                "Department code is required.",

            );

        }


        return normalizedCode;

    }


    private validateId(

        id: string,

    ): string {

        const normalizedId =
            typeof id === "string"
                ? id.trim()
                : "";


        if (!normalizedId) {

            throw new Error(

                "Department id is required.",

            );

        }


        return normalizedId;

    }

}