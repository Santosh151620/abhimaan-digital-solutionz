export interface Designation {

    id:string;

    organizationId:string;

    departmentId?:string;

    designationCode:string;

    designationName:string;

    description?:string;

    status:"Active" | "Inactive";

    metadata:Record<string, unknown>;

    createdAt:string;

    updatedAt:string;

}