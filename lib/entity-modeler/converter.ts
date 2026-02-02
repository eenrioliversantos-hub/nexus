import { Entity as OldEntity, Relationship as OldRelationship, EntityField as OldEntityField } from '../../types';
import { Entity as NewEntity, Attribute, Relationship as NewRelationship, DataType } from './types';

const snakeCase = (str: string): string => {
    if (!str) return '';
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_+/, '');
}

// A complete, default structure for a new entity
const defaultNewEntityStructure = {
  description: 'Entidade que representa um conceito no sistema.',
  dataStructure: {
    type: 'Tabela Hash',
    logicalOrganization: 'Linear',
    physicalOrganization: 'Indexada',
    timeComplexity: 'O(1)',
    classificationNature: 'Dinâmica',
    classificationAllocation: 'Dinâmica (Heap)',
    keyOperations: ['Inserção O(1)', 'Busca O(1)', 'Deleção O(1)'],
  },
  attributes: [],
  relationships: [],
  endpoints: [],
  actions: [],
  lifecycle: {
    statusField: 'status',
    defaultStatus: 'ATIVO',
    transitions: [],
  },
  security: {
    policies: [],
    validationRules: [],
    hasAudit: true,
    isVersioned: false,
  },
  integration: {
    exposureChannels: [],
    frontendRoutes: [],
  },
  indexing: {
    customIndexes: [],
  },
  dataGovernance: {
    retentionPolicy: { type: 'NONE', afterDays: 0, notes: '' },
    archivalPolicy: { enabled: false, afterYears: 0, targetStorage: '', notes: '' },
    dataOwner: '',
  },
  dataFlow: {
    upstreamSystems: [],
    downstreamSystems: [],
    domainEvents: [],
  },
};

const mapOldTypeToNew = (type: OldEntityField['type']): DataType => {
    switch (type) {
        case 'string': return 'VARCHAR';
        case 'text': return 'TEXT';
        case 'number': return 'INTEGER';
        case 'boolean': return 'BOOLEAN';
        case 'date': return 'DATETIME';
        case 'foreign_key': return 'UUID';
        case 'json': return 'JSONB';
        default: return 'VARCHAR';
    }
};

const mapNewTypeToOld = (type: DataType): OldEntityField['type'] => {
    switch (type) {
        case 'VARCHAR': return 'string';
        case 'TEXT': return 'text';
        case 'INTEGER': return 'number';
        case 'BIGINT': return 'number';
        case 'FLOAT': return 'number';
        case 'DECIMAL': return 'number';
        case 'BOOLEAN': return 'boolean';
        case 'DATE': return 'date';
        case 'DATETIME': return 'date';
        case 'UUID': return 'foreign_key';
        case 'JSONB': return 'json';
        default: return 'string';
    }
};

export function convertOldToNewFormat(oldEntities: OldEntity[], oldRelationships: OldRelationship[]): NewEntity[] {
    if (!oldEntities) return [];

    return oldEntities.map(oldEntity => {
        const attributes: Attribute[] = (oldEntity.fields || []).map((field: OldEntityField, index: number) => ({
            id: index + 1,
            name: field.name,
            type: mapOldTypeToNew(field.type),
            isPK: field.name.toLowerCase() === 'id',
            isNN: field.required,
            isUnique: field.unique || false,
            isSearchable: field.indexed || false,
        }));
        
        const relationships: NewRelationship[] = (oldEntity.relationships || []).map((rel, index) => ({
            id: index + 1,
            name: `${rel.targetEntity.toLowerCase()}_rel`,
            targetEntity: rel.targetEntity,
            type: rel.type as NewRelationship['type'],
            fkField: rel.foreignKey || `${snakeCase(rel.targetEntity)}_id`,
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        }));

        return {
            ...defaultNewEntityStructure,
            id: oldEntity.id,
            name: oldEntity.name,
            physicalName: snakeCase(oldEntity.name) + 's',
            description: oldEntity.description || defaultNewEntityStructure.description,
            attributes,
            relationships,
        };
    });
}

export function convertNewToOldFormat(newEntities: NewEntity[]): OldEntity[] {
    if (!newEntities) return [];

    return newEntities.map(newEntity => {
        const fields: OldEntityField[] = newEntity.attributes.map(attr => ({
            id: String(attr.id),
            name: attr.name,
            type: mapNewTypeToOld(attr.type),
            required: attr.isNN || false,
            unique: attr.isUnique,
            indexed: attr.isSearchable,
            description: '',
        }));
        
        const relationships: OldRelationship[] = newEntity.relationships.map(rel => ({
            type: rel.type as OldRelationship['type'],
            targetEntity: rel.targetEntity,
            description: rel.name,
            foreignKey: rel.fkField,
        }));

        return {
            id: newEntity.id,
            name: newEntity.name,
            description: newEntity.description,
            fields: fields,
            relationships: relationships,
            businessRules: []
        };
    });
}
