export interface EntityReference {
  entityType: string;
  entityId: string;
}

export class EntityService {
  static getReference(
    entityType: string,
    entityId: string,
  ): EntityReference {
    return {
      entityType,
      entityId,
    };
  }

  static isValid(reference: EntityReference): boolean {
    return (
      reference.entityType.trim().length > 0 &&
      reference.entityId.trim().length > 0
    );
  }

  static getKey(reference: EntityReference): string {
    return `${reference.entityType}:${reference.entityId}`;
  }
}