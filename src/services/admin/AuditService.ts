 /**
  * ============================================================================
  * ADS ENTERPRISE PLATFORM
  *
  * Audit Service
  *
  * Application layer for:
  * - Admin
  * - CRM
  * - Workflow
  * - Security events
  *
  * Responsibilities:
  * - Validate audit records before persistence
  * - Normalize audit query filters
  * - Enforce safe audit query limits
  * - Delegate persistence to the audit repository
  *
  * Security:
  * - Tenant scoping remains the responsibility of the repository layer
  * - This service does not bypass repository security boundaries
  * ============================================================================
  */

 import type {
     AuditRecord,
 } from "@/types/admin/Audit";


 import type {
     IAuditRepository,
 } from "@/repositories/admin/AuditRepository";



 const MAX_AUDIT_QUERY_LIMIT =
     500;



 export class AuditService {



     constructor(

         private readonly repository:
             IAuditRepository,

     ) {}



     /**
      * Persist one validated audit record.
      *
      * The repository remains responsible for tenant scoping,
      * authorization and database-level security.
      */
     async log(

         entry: AuditRecord,

     ):

     Promise<void> {

         const normalized =
             this.normalizeAudit(
                 entry,
             );


         await this.repository.log(

             {

                 ...entry,

                 action:
                     normalized.action,

                 entityType:
                     normalized.entityType,

                 entityId:
                     normalized.entityId,

                 createdAt:
                     normalized.createdAt,

             },

         );

     }



     /**
      * Query audit records using normalized, bounded filters.
      */
     async getLogs(

         options?: {

             entityType?: string;

             entityId?: string;

             limit?: number;

         },

     ):

     Promise<AuditRecord[]> {


         const entityType =
             this.normalizeOptionalText(
                 options?.entityType,
             );


         const entityId =
             this.normalizeOptionalText(
                 options?.entityId,
             );


         return this.repository.getLogs(

             {

                 entityType,

                 entityId,

                 limit:
                     this.normalizeLimit(
                         options?.limit,
                     ),

             },

         );

     }



     /**
      * Validate and normalize an audit record.
      */
     private normalizeAudit(

         entry: AuditRecord,

     ): {

         action: string;

         entityType: string;

         entityId: string;

         createdAt: string;

     } {


         if (

             !entry ||

             typeof entry !== "object"

         ) {

             throw new Error(

                 "Audit entry is required.",

             );

         }


         const action =
             typeof entry.action ===
             "string"

                 ? entry.action.trim()

                 : "";


         const entityType =
             typeof entry.entityType ===
             "string"

                 ? entry.entityType.trim()

                 : "";


         const entityId =
             typeof entry.entityId ===
             "string"

                 ? entry.entityId.trim()

                 : "";


         if (!action) {

             throw new Error(

                 "Audit action is required.",

             );

         }


         if (!entityType) {

             throw new Error(

                 "Audit entity type is required.",

             );

         }


         if (!entityId) {

             throw new Error(

                 "Audit entity id is required.",

             );

         }


         return {

             action,

             entityType,

             entityId,

             createdAt:
                 this.normalizeCreatedAt(
                     entry.createdAt,
                 ),

         };

     }



     /**
      * Normalize optional query text.
      *
      * Empty strings are converted to undefined so they do not
      * become meaningless repository filters.
      */
     private normalizeOptionalText(

         value?: string,

     ): string | undefined {


         if (

             typeof value !==
             "string"

         ) {

             return undefined;

         }


         const normalized =
             value.trim();


         return normalized || undefined;

     }



     /**
      * Normalize the audit timestamp.
      *
      * Existing timestamps are preserved. Missing timestamps use
      * the current UTC timestamp.
      */
     private normalizeCreatedAt(

         createdAt?: string,

     ): string {


         const normalized =
             typeof createdAt ===
             "string"

                 ? createdAt.trim()

                 : "";


         return (

             normalized ||

             new Date().toISOString()

         );

     }



     /**
      * Enforce a safe upper bound on audit queries.
      *
      * Fractional values are rejected rather than being silently
      * converted to zero by Math.floor().
      */
     private normalizeLimit(

         limit?: number,

     ): number | undefined {


         if (

             limit === undefined

         ) {

             return undefined;

         }


         if (

             typeof limit !==
             "number" ||

             !Number.isFinite(
                 limit,
             )

         ) {

             throw new Error(

                 "Audit limit must be a finite number.",

             );

         }


         if (

             !Number.isInteger(
                 limit,
             )

         ) {

             throw new Error(

                 "Audit limit must be an integer.",

             );

         }


         if (

             limit <= 0

         ) {

             throw new Error(

                 "Audit limit must be greater than zero.",

             );

         }


         return Math.min(

             limit,

             MAX_AUDIT_QUERY_LIMIT,

         );

     }

 }