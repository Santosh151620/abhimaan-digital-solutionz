"use server";

import type {
    Team,
} from "@/types/admin/Team";

import {
    TeamsRepository,
} from "@/repositories/admin/TeamsRepository";

const repository =
    new TeamsRepository();

export async function getTeams(): Promise<Team[]> {
    return await repository.findAll();
}

export async function saveTeam(
    team: Partial<Team>,
): Promise<Team> {
    return await repository.save(
        team,
    );
}

export async function deleteTeam(
    id: string,
): Promise<void> {
    await repository.delete(
        id,
    );
}
