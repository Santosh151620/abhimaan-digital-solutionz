'use server';

import type {
    Activity,
} from '@/types/activity';

export async function getTaskActivities(
    _taskId: string
): Promise<Activity[]> {
    return [];
}