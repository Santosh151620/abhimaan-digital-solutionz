import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import type {
    Permission,
} from "@/types/admin/Permission";


type PermissionRow = {

    id: string;

    permission_key: string;

    module_name: string;

    action_name: string;

    description: string | null;

    metadata: Record<string, unknown> | null;

    is_system_permission: boolean | null;

    created_at: string;

    updated_at: string;

};

export interface IPermissionsRepository {


    list():Promise<Permission[]>;


    findById(
        id:string,
    ):Promise<Permission|null>;


    findByKey(
        key:string,
    ):Promise<Permission|null>;


    save(
        permission:Permission,
    ):Promise<void>;


    delete(
        id:string,
    ):Promise<void>;

}




export class PermissionsRepository
extends BaseRepository<Permission>
implements IPermissionsRepository {


constructor(
supabase:SupabaseClient,
){

super(
supabase,
"admin_permissions",
);

}



async list():Promise<Permission[]> {


const {
data,
error,

}=await this
.tableRef()
.select("*")
.order(
"module_name",
{
ascending:true,
}
);



if(error)
throw error;

return (data ?? []).map(
    (item) => this.mapPermission(item as PermissionRow),
);



}




async findById(
id:string,
)
:Promise<Permission|null>{


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



return data
? this.mapPermission(data)
:null;


}





async findByKey(
key:string,
)
:Promise<Permission|null>{


const {
data,
error,

}=await this
.tableRef()
.select("*")
.eq(
"permission_key",
key,
)
.maybeSingle();



if(error)
throw error;



return data
? this.mapPermission(data)
:null;


}




async save(
permission:Permission,
)
:Promise<void>{



const {
error,

}=await this
.tableRef()
.upsert({

id:
permission.id,


permission_key:
permission.key,


module_name:
permission.module,


action_name:
permission.action,


description:
permission.description,


is_system_permission:
permission.isSystem,


metadata:
permission.metadata ?? {},

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


private mapPermission(
    item: PermissionRow,
): Permission {


return {


id:item.id,


key:
item.permission_key,


module:
item.module_name,


action:
item.action_name,


name:
item.permission_key,

description: item.description ?? undefined,

type:
item.is_system_permission
?"System"
:"Custom",


isSystem:
item.is_system_permission ?? false,


isActive:true,


metadata:
item.metadata ?? {},


createdAt:
item.created_at,


updatedAt:
item.updated_at,


};


}


}