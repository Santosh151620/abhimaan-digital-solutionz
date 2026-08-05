import type {
    ImportConfiguration,
    ImportExportEntityType,
} from "@/types/crm/ImportExport";

export class ImportRegistry {

    private readonly registry =
        new Map<
            ImportExportEntityType,
            ImportConfiguration
        >();

    register(
        configuration: ImportConfiguration,
    ): void {

        this.registry.set(
            configuration.entityType,
            configuration,
        );

    }

    get(
        entityType: ImportExportEntityType,
    ): ImportConfiguration {

        const configuration =
            this.registry.get(entityType);

        if (!configuration) {

            throw new Error(
                `Import configuration not found for ${entityType}`,
            );

        }

        return configuration;

    }

    has(
        entityType: ImportExportEntityType,
    ): boolean {

        return this.registry.has(
            entityType,
        );

    }

    all(): ImportConfiguration[] {

        return Array.from(
            this.registry.values(),
        );

    }

}

export const ImportRegistryInstance =
    new ImportRegistry();