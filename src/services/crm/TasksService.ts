import {
    TasksRepositoryInstance,
} from '@/repositories/crm/TasksRepository';


import {
    ActivityServiceInstance,
} from '@/services/crm/ActivityService';


import type {
    Task,
    TaskStatus,
} from '@/types/crm/Tasks';



class TasksService {


    list() {

        return TasksRepositoryInstance.list();

    }



    listArchived() {

        return TasksRepositoryInstance.listArchived();

    }



    findById(
        id:string
    ) {

        return TasksRepositoryInstance.findById(
            id
        );

    }



    details(
        id:string
    ) {

        return this.findById(id);

    }



    search(
        filters?: {

            status?:TaskStatus;

            priority?:Task['priority'];

            search?:string;

        }
    ) {

        return TasksRepositoryInstance.search(
            filters
        );

    }



    create(
        data:Partial<Task>
    ) {


        const task =
            TasksRepositoryInstance.create(
                data
            );



        ActivityServiceInstance.create({

            entityType:
                'Task',

            entityId:
                task.id,

            action:
                'Created',

            description:
                `Task created: ${task.title}`,

        });



        return task;

    }




    update(
        id:string,
        data:Partial<Task>
    ) {


        const task =
            TasksRepositoryInstance.update(
                id,
                data
            );



        if (task) {


            ActivityServiceInstance.create({

                entityType:
                    'Task',

                entityId:
                    id,

                action:
                    'Updated',

                description:
                    `Task updated: ${task.title}`,

            });


        }



        return task;

    }




    updateStatus(
        id:string,
        status:TaskStatus
    ) {


        const task =
            TasksRepositoryInstance.updateStatus(
                id,
                status
            );



        if (task) {


            ActivityServiceInstance.create({

                entityType:
                    'Task',

                entityId:
                    id,

                action:
                    'Status Changed',

                description:
                    `Task status changed to ${status}`,

            });


        }



        return task;

    }




    delete(
        id:string
    ) {


        const result =
            TasksRepositoryInstance.delete(
                id
            );



        if (result) {


            ActivityServiceInstance.create({

                entityType:
                    'Task',

                entityId:
                    id,

                action:
                    'Deleted',

                description:
                    'Task archived',

            });


        }



        return result;

    }




    restore(
        id:string
    ) {


        const result =
            TasksRepositoryInstance.restore(
                id
            );



        if (result) {


            ActivityServiceInstance.create({

                entityType:
                    'Task',

                entityId:
                    id,

                action:
                    'Restored',

                description:
                    'Task restored',

            });


        }



        return result;

    }




    summary() {

        return TasksRepositoryInstance.summary();

    }


}



export const
    TasksServiceInstance =
        new TasksService();