import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    BaseRepository,
} from "@/lib/db/base-repository";

import type {
    Role,
} from "@/types/admin/Role";



export interface IRolesRepository {

    list(): Promise<Role[]>;

    findById(
        id:string,
    ): Promise<Role | null>;

    findByCode(
        code:string,
    ): Promise<Role | null>;

    save(
        role:Role,
    ): Promise<void>;

    delete(
        id:string,
    ): Promise<void>;

}



export class RolesRepository
extends BaseRepository<Role>
implements IRolesRepository {


constructor(
    supabase:SupabaseClient,
){

    super(
        supabase,
        "admin_roles",
    );

}



async list():Promise<Role[]> {


const {
    data,
    error,

}= await this
.tableRef()
.select("*")
.order(
    "role_name",
    {
        ascending:true,
    },
);



if(error)
throw error;



return (
    data ?? []
).map((item)=>({

    id:item.id,

    organizationId:
        item.organization_id,

    name:
        item.role_name,

    code:
        item.role_key,

    description:
        item.description,

    type:
        item.is_system_role
        ? "System"
        : "Organization",

    level:
        "Organization",

    status:
        item.status === "active"
        ? "Active"
        : "Inactive",

    permissionIds:[],

    isSystem:
        item.is_system_role ?? false,

    isDefault:false,

    isActive:
        item.status === "active",

    createdAt:
        item.created_at,

    updatedAt:
        item.updated_at,

})) as Role[];


}



async findById(
id:string,
)
:Promise<Role|null>{


const {
data,
error,

}=await this
.tableRef()
.select("*")
.eq(
"id",
id,
)
.maybeSingle();



if(error)
throw error;



if(!data)
return null;



return {

id:data.id,

organizationId:
data.organization_id,

name:
data.role_name,

code:
data.role_key,

description:
data.description,

type:
data.is_system_role
?"System"
:"Organization",

level:
"Organization",

status:
data.status==="active"
?"Active"
:"Inactive",

permissionIds:[],

isSystem:
data.is_system_role ?? false,

isDefault:false,

isActive:
data.status==="active",

createdAt:
data.created_at,

updatedAt:
data.updated_at,

};

}




async findByCode(
code:string,
)
:Promise<Role|null>{


const {
data,
error,

}=await this
.tableRef()
.select("*")
.eq(
"role_key",
code,
)
.maybeSingle();



if(error)
throw error;


return data
? await this.findById(data.id)
:null;


}




async save(
role:Role,
)
:Promise<void>{



const {
error,

}=await this
.tableRef()
.upsert({

id:
role.id,

organization_id:
role.organizationId,

role_name:
role.name,

role_key:
role.code,

description:
role.description,

is_system_role:
role.isSystem,

status:
role.isActive
?"active"
:"inactive",

});



if(error)
throw error;


}




async delete(
id:string,
)
:Promise<void>{


await super.delete(id);


}



}