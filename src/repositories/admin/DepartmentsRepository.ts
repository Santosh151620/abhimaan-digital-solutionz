import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import type {
    Department,
} from "@/types/admin/Department";



type DepartmentRow = {

    id:string;

    organization_id:string;

    department_code:string;

    department_name:string;

    parent_department_id:string | null;

    manager_id:string | null;

    status:string;

    metadata:Record<string,unknown> | null;

    created_at:string;

    updated_at:string;

};



export interface IDepartmentsRepository {


    list():
        Promise<Department[]>;


    active():
        Promise<Department[]>;


    findById(
        id:string,
    ):
        Promise<Department | null>;



    findByCode(
        code:string,
    ):
        Promise<Department | null>;



    save(
        department:Partial<Department>,
    ):
        Promise<Department>;



    delete(
        id:string,
    ):
        Promise<void>;

}



export class DepartmentsRepository
    extends BaseRepository<Department>
    implements IDepartmentsRepository {



    constructor(
        supabase:SupabaseClient,
    ){

        super(
            supabase,
            "departments",
        );

    }



    async list():

        Promise<Department[]> {


        const {
            data,
            error,

        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .order(
                    "department_name",
                    {
                        ascending:true,
                    },
                );


        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapDepartment(
                        row as DepartmentRow,
                    ),
            );

    }





    async active():

        Promise<Department[]> {



        const {
            data,
            error,

        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "status",
                    "Active",
                )
                .order(
                    "department_name",
                    {
                        ascending:true,
                    },
                );


        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapDepartment(
                        row as DepartmentRow,
                    ),
            );

    }





    async findById(
        id:string,
    ):
        Promise<Department | null>{


        const {
            data,
            error,

        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    id,
                )
                .maybeSingle();



        if(error)
            throw error;



        return data
            ? this.mapDepartment(
                data as DepartmentRow,
            )
            : null;

    }





    async findByCode(
        code:string,
    ):
        Promise<Department | null>{


        const {
            data,
            error,

        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "department_code",
                    code.trim().toUpperCase(),
                )
                .maybeSingle();



        if(error)
            throw error;



        return data
            ? this.mapDepartment(
                data as DepartmentRow,
            )
            : null;

    }





    async save(
        department:Partial<Department>,
    ):
        Promise<Department>{


        const now =
            new Date()
                .toISOString();



        const {
            data,
            error,

        } =
            await this
                .tableRef()
                .upsert(
                    {

                        id:
                            department.id,

                        organization_id:
                            this.organizationId,

                        department_code:
                            department.departmentCode
                                ?.trim()
                                .toUpperCase(),

                        department_name:
                            department.departmentName
                                ?.trim(),

                        parent_department_id:
                            department.parentDepartmentId ?? null,

                        manager_id:
                            department.managerId ?? null,

                        status:
                            department.status ?? "Active",

                        metadata:
                            department.metadata ?? {},

                        created_at:
                            department.createdAt ?? now,

                        updated_at:
                            now,

                    },
                    {
                        onConflict:"id",
                    },
                )
                .select()
                .single();



        if(error)
            throw error;



        return this.mapDepartment(
            data as DepartmentRow,
        );

    }





    async delete(
        id:string,
    ):
        Promise<void>{


        await super.delete(
            id,
        );

    }





    private mapDepartment(
        row:DepartmentRow,
    ):
        Department {


        return {

            id:
                row.id,


            organizationId:
                row.organization_id,


            departmentCode:
                row.department_code,


            departmentName:
                row.department_name,


            parentDepartmentId:
                row.parent_department_id ?? undefined,


            managerId:
                row.manager_id ?? undefined,


            status:
                row.status as Department["status"],


            metadata:
                row.metadata ?? {},


            createdAt:
                row.created_at,


            updatedAt:
                row.updated_at,

        };


    }


}