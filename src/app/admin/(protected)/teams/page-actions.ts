"use server";

import type {
    Team,
} from "@/types/admin/Team";

import {
    TeamsRepository,
} from "@/repositories/admin/TeamsRepository";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";


async function getRepository(): Promise<TeamsRepository> {

    const supabase =
        await createSupabaseServerClient();

    return new TeamsRepository(
        supabase,
    );
}


export async function getTeams(): Promise<Team[]> {

    const repository =
        await getRepository();

    return repository.findAll();
}


export async function saveTeam(
    team: Partial<Team>,
): Promise<Team> {

    const repository =
        await getRepository();

    return repository.save(
        team,
    );
}


async function deleteTeam(
    id: string,
): Promise<void> {

    const repository =
        await getRepository();

    await repository.delete(
        id,
    );
}