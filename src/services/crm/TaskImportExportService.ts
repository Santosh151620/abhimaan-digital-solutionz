import type {
    Task,
} from '@/types/crm/Tasks';

import { TasksServiceInstance } from '@/services/crm/TasksService';



class TaskImportExportService {


    async exportTasks(): Promise<Record<string, unknown>[]> {

        const tasks =
            await TasksServiceInstance.list();


        return tasks.map(
            (task: Task) => ({

                id:
                    task.id,

                taskNumber:
                    task.taskNumber,

                title:
                    task.title,

                status:
                    task.status,

                priority:
                    task.priority,

                assignedTo:
                    task.assignedTo ?? '',

                dueDate:
                    task.dueDate ?? '',

                completionPercentage:
                    task.completionPercentage ?? 0,

                createdAt:
                    task.createdAt,

            }),
        );

    }



    async importTasks(
        rows: Record<string, unknown>[],
    ): Promise<Task[]> {


        const created: Task[] = [];


        for (
            const row of rows
        ) {

            const task =
                await TasksServiceInstance.create({

                    title:
                        String(
                            row.title ?? '',
                        ),

                    status:
                        row.status as Task['status'],

                    priority:
                        row.priority as Task['priority'],

                    assignedTo:
                        row.assignedTo
                            ? String(row.assignedTo)
                            : undefined,

                    dueDate:
                        row.dueDate
                            ? String(row.dueDate)
                            : undefined,

                });


            created.push(
                task,
            );

        }


        return created;

    }



    /**
     * Backward compatible CSV export
     */
    async exportCSV(): Promise<string> {

        const rows =
            await this.exportTasks();


        if (
            rows.length === 0
        ) {

            return '';

        }


        const headers =
            Object.keys(
                rows[0],
            );


        const csvRows =
            rows.map(
                row =>
                    headers
                        .map(
                            header =>
                                `"${String(
                                    row[header] ?? '',
                                ).replace(
                                    /"/g,
                                    '""',
                                )}"`,
                        )
                        .join(','),
            );


        return [
            headers.join(','),
            ...csvRows,
        ].join('\n');

    }



    /**
     * Backward compatible CSV import
     */
    async importCSV(
        csv: string,
    ): Promise<Task[]> {


        const lines =
            csv
                .split(/\r?\n/)
                .filter(
                    line =>
                        line.trim().length > 0,
                );


        if (
            lines.length <= 1
        ) {

            return [];

        }


        const headers =
            lines[0]
                .split(',')
                .map(
                    header =>
                        header.trim(),
                );


        const rows =
            lines
                .slice(1)
                .map(
                    line => {

                        const values =
                            line
                                .split(',')
                                .map(
                                    value =>
                                        value
                                            .replace(/^"|"$/g, '')
                                            .trim(),
                                );


                        return headers.reduce(
                            (
                                result,
                                header,
                                index,
                            ) => {

                                result[header] =
                                    values[index];

                                return result;

                            },
                            {} as Record<string, unknown>,
                        );

                    },
                );


        return this.importTasks(
            rows,
        );

    }

}


export const TaskImportExportServiceInstance =
    new TaskImportExportService();