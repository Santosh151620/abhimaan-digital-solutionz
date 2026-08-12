'use server';


import {
    TaskImportExportServiceInstance,
} from '@/services/crm/TaskImportExportService';



export async function exportTasksCSV() {

    return TaskImportExportServiceInstance.exportCSV();

}



async function importTasksCSV(
    csv:string
) {

    return TaskImportExportServiceInstance.importCSV(
        csv
    );

}

