import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";

import type {
    FilterDefinition,
    SavedFilter,
} from "@/types/crm/Filter";



export class FilterRepository {


    private async client() {

        return createSupabaseServerClient();

    }



    async create(
        filter: FilterDefinition,
    ): Promise<FilterDefinition> {


        const supabase =
            await this.client();



        const {
            data,
            error,
        } = await supabase
            .from("saved_filters")
            .insert({

                organization_id:
                    filter.organizationId,

                entity_type:
                    filter.entityType,

                name:
                    filter.name,

                description:
                    filter.description,

                definition:
                    filter,

                is_active:
                    filter.isActive ?? true,

                created_by:
                    filter.createdBy,

            })
            .select()
            .single();



        if(error){

            throw error;

        }



        return {

            ...filter,

            id:
                data.id,

            createdAt:
                data.created_at,

            updatedAt:
                data.updated_at,

        };

    }





    async update(
        id: string,
        filter: Partial<FilterDefinition>,
    ): Promise<FilterDefinition> {


        const supabase =
            await this.client();



        const {
            data,
            error,
        } =
            await supabase
                .from("saved_filters")
                .update({

                    name:
                        filter.name,

                    description:
                        filter.description,

                    definition:
                        filter,

                    is_active:
                        filter.isActive,

                    updated_at:
                        new Date()
                            .toISOString(),

                })
                .eq(
                    "id",
                    id,
                )
                .select()
                .single();



        if(error){

            throw error;

        }



        return {

            ...filter,

            id:
                data.id,

            updatedAt:
                data.updated_at,

        } as FilterDefinition;

    }





    async delete(
        id: string,
    ): Promise<void> {


        const supabase =
            await this.client();



        const {
            error,
        } =
            await supabase
                .from("saved_filters")
                .delete()
                .eq(
                    "id",
                    id,
                );



        if(error){

            throw error;

        }

    }





    async findByEntity(
        entityType: string,
    ): Promise<SavedFilter[]> {


        const supabase =
            await this.client();



        const {
            data,
            error,
        } =
            await supabase
                .from("saved_filters")
                .select("*")
                .eq(
                    "entity_type",
                    entityType,
                )
                .order(
                    "created_at",
                    {
                        ascending:false,
                    },
                );



        if(error){

            throw error;

        }


return (data ?? [])
    .map(
        (
            item: {
                id: string;
                organization_id: string;
                entity_type: string;
                name: string;
                definition: FilterDefinition;
                is_default?: boolean;
                created_by?: string;
                created_at?: string;
                updated_at?: string;
            }
        ) => ({
                    id:
                        item.id,

                    organizationId:
                        item.organization_id,

                    entityType:
                        item.entity_type,

                    name:
                        item.name,

                    filter:
                        item.definition,

                    isDefault:
                        item.is_default,

                    createdBy:
                        item.created_by,

                    createdAt:
                        item.created_at,

                    updatedAt:
                        item.updated_at,

                }),
            );

    }





    async findById(
        id: string,
    ): Promise<SavedFilter | null> {


        const supabase =
            await this.client();



        const {
            data,
            error,
        } =
            await supabase
                .from("saved_filters")
                .select("*")
                .eq(
                    "id",
                    id,
                )
                .maybeSingle();



        if(error){

            throw error;

        }



        if(!data){

            return null;

        }



        return {

            id:
                data.id,

            organizationId:
                data.organization_id,

            entityType:
                data.entity_type,

            name:
                data.name,

            filter:
                data.definition,

            isDefault:
                data.is_default,

            createdBy:
                data.created_by,

            createdAt:
                data.created_at,

            updatedAt:
                data.updated_at,

        };

    }


}


export const filterRepository =
    new FilterRepository();