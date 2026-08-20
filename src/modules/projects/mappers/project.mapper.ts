import type {
    Project,
} from "@/modules/projects/types/project";


type RawProject =
    Record<string, unknown>;


function optionalString(
    value: unknown,
): string | undefined {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return undefined;

    }

    return String(value);

}


/**
 * Project Mapper
 *
 * Maps raw backend/API objects into the
 * canonical CRM Project domain model.
 */
export class ProjectMapper {


    static toDomain(
        raw: RawProject,
    ): Project {

        return {

            id:
                String(
                    raw.id ?? "",
                ),

            projectNumber:
                String(
                    raw.projectNumber ??
                    raw.project_number ??
                    "",
                ),

            companyId:
                optionalString(
                    raw.companyId ??
                    raw.company_id,
                ),

            contactId:
                optionalString(
                    raw.contactId ??
                    raw.contact_id,
                ),

            opportunityId:
                optionalString(
                    raw.opportunityId ??
                    raw.opportunity_id,
                ),

            contractId:
                optionalString(
                    raw.contractId ??
                    raw.contract_id,
                ),

            customerName:
                optionalString(
                    raw.customerName ??
                    raw.customer_name,
                ),

            name:
                String(
                    raw.name ?? "",
                ),

            description:
                optionalString(
                    raw.description,
                ),

            status:
                (raw.status as Project["status"]) ??
                "Planning",

            projectType:
                optionalString(
                    raw.projectType ??
                    raw.project_type,
                ),

            priority:
                optionalString(
                    raw.priority,
                ),

            ownerUserId:
                optionalString(
                    raw.ownerUserId ??
                    raw.owner_user_id,
                ),

            manager:
                optionalString(
                    raw.manager,
                ),

            startDate:
                optionalString(
                    raw.startDate ??
                    raw.start_date,
                ),

            endDate:
                optionalString(
                    raw.endDate ??
                    raw.end_date,
                ),

            actualEndDate:
                optionalString(
                    raw.actualEndDate ??
                    raw.actual_end_date,
                ),

            budget:
                Number(
                    raw.budget ?? 0,
                ),

            actualCost:
                raw.actualCost !== null &&
                raw.actualCost !== undefined
                    ? Number(
                        raw.actualCost,
                    )
                    : undefined,

            currency:
                optionalString(
                    raw.currency,
                ),

            metadata:
                raw.metadata &&
                typeof raw.metadata === "object"
                    ? raw.metadata as Record<
                        string,
                        unknown
                    >
                    : undefined,

            progressPercent:
                raw.progressPercent !== null &&
                raw.progressPercent !== undefined
                    ? Number(
                        raw.progressPercent,
                    )
                    : raw.progress_percentage !== null &&
                      raw.progress_percentage !== undefined
                        ? Number(
                            raw.progress_percentage,
                        )
                        : undefined,

            archived:
                raw.archived !== null &&
                raw.archived !== undefined
                    ? Boolean(
                        raw.archived,
                    )
                    : undefined,

            createdAt:
                String(
                    raw.createdAt ??
                    raw.created_at ??
                    "",
                ),

            updatedAt:
                String(
                    raw.updatedAt ??
                    raw.updated_at ??
                    "",
                ),

        };

    }


    static toDomainList(
        rawList: RawProject[],
    ): Project[] {

        return rawList.map(
            (item) =>
                this.toDomain(item),
        );

    }

}
