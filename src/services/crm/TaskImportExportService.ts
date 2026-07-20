import {
    TasksServiceInstance,
} from '@/services/crm/TasksService';


import type {
    Task,
} from '@/types/crm/Tasks';



class TaskImportExportService {


    exportCSV() {


        const tasks =
            TasksServiceInstance.list();



        const headers = [

            'taskNumber',

            'title',

            'description',

            'status',

            'priority',

            'dueDate',

        ];



        const rows =
            tasks.map(
                task => [

                    task.taskNumber,

                    task.title,

                    task.description ?? '',

                    task.status,

                    task.priority,

                    task.dueDate ?? '',

                ]
            );



        return [

            headers.join(','),

            ...rows.map(
                row =>
                    row.join(',')
            ),

        ].join('\n');


    }




    importCSV(
        csv:string
    ) {


        const lines =
            csv
                .split('\n')
                .filter(
                    line =>
                        line.trim()
                );



        const data =
            lines.slice(1);



        const created:Task[] = [];



        for (
            const line of data
        ) {


            const [

                taskNumber,

                title,

                description,

                status,

                priority,

                dueDate,

            ] =
                line.split(',');



            const task =
                TasksServiceInstance.create({

                    taskNumber,

                    title,

                    description,

                    status:
                        status as Task['status'],

                    priority:
                        priority as Task['priority'],

                    dueDate,

                });



            created.push(
                task
            );


        }



        return created;


    }


}



export const
    TaskImportExportServiceInstance =
        new TaskImportExportService();