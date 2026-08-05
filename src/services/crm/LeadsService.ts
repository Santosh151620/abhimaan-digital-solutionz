import type {
    Lead,
    LeadFilters,
} from "@/types/lead";


import type {
    ImportExecutionResult,
    ImportExecutionOptions,
    ExportRequest,
} from "@/types/crm/ImportExport";


import {
    FilterService,
} from "./FilterService";


import {
    ImportService,
} from "./ImportService";


import {
    ExportService,
} from "./ExportService";


import {
    ImportTemplateService,
} from "./ImportTemplateService";


import {
    DuplicateDetectionService,
} from "./DuplicateDetectionService";



export class LeadsService {


    private readonly filterService =
        new FilterService();



    private readonly importService =
        new ImportService();



    private readonly exportService =
        new ExportService();



    private readonly templateService =
        new ImportTemplateService();



    private readonly duplicateService =
        new DuplicateDetectionService();




    /**
     * Lead filtering
     */
    filter(
        leads: Lead[],
        filters: LeadFilters,
    ): Lead[] {


        const result =

            this.filterService.apply(

                leads.map(

                    lead =>

                        ({
                            ...lead,
                        }),

                ),


                filters as unknown as Record<
                    string,
                    unknown
                >,

            );


        return result as unknown as Lead[];

    }





    /**
     * Lead search
     */
    search(
        leads: Lead[],
        keyword: string,
    ): Lead[] {


        const normalized =

            keyword
                .trim()
                .toLowerCase();



        if (!normalized) {

            return leads;

        }



        return leads.filter(

            lead =>

                lead.full_name
                    .toLowerCase()
                    .includes(
                        normalized,
                    )

                ||

                lead.email
                    .toLowerCase()
                    .includes(
                        normalized,
                    )

                ||

                (
                    lead.company
                    ??
                    ""
                )
                    .toLowerCase()
                    .includes(
                        normalized,
                    ),

        );

    }





    /**
     * Import execution
     */
    async import(
        options: ImportExecutionOptions,
    ): Promise<ImportExecutionResult> {


        return this.importService.execute(
            options,
        );

    }





    /**
     * Export execution
     */
    async export(
        request: ExportRequest,
        leads: Lead[],
    ): Promise<string> {


        return this.exportService.execute(

            request,


            leads.map(

                lead =>

                    lead as unknown as Record<
                        string,
                        unknown
                    >,

            ),

        );

    }





    /**
     * CSV template generation
     */
    createTemplate(
        columns: Parameters<
            typeof this.templateService.generateTemplate
        >[0],
    ): string {


        return this.templateService.generateTemplate(
            columns,
        );

    }





    /**
     * Duplicate protection
     */
    hasDuplicate(
        existing: Lead[],
        incoming: Lead,
    ): boolean {


        return this.duplicateService.check({

            existingRows:

                existing.map(

                    item =>

                        item as unknown as Record<
                            string,
                            unknown
                        >,

                ),


            incomingRow:

                incoming as unknown as Record<
                    string,
                    unknown
                >,


            uniqueFields: [

                "email",

                "phone",

            ],

        })
        .duplicate;

    }


}




export const LeadsServiceInstance =
    new LeadsService();