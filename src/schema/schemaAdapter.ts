// src/schema/schemaAdapter.ts
// Adapter to transform the incoming schema into a structure our components can use

import type { Schema, FieldDefinition } from "../types/SchemaTypes";

/**
 * Adapt the incoming schema structure to match our application's expected format
 * This transforms the single-example schema format from our JSON files
 * into a format with multiple fields, groups, and sections
 * 
 * @param rawSchema The raw schema loaded from JSON file
 * @returns Adapted schema with structured arrays of components
 */
export function adaptSchema(rawSchema: any): Schema {
  if (!rawSchema) return rawSchema;
  
  // Start with a copy of the raw schema
  const adaptedSchema: any = {
    ...rawSchema,
    fields: [],
    fieldGroups: [],
    sections: []
  };
  
  // Extract single examples into arrays
  if (rawSchema.FieldDefinition) {
    adaptedSchema.fields.push(rawSchema.FieldDefinition);
  }
  
  if (rawSchema.FieldGroupTemplate) {
    adaptedSchema.fieldGroups.push(rawSchema.FieldGroupTemplate);
  }
  
  if (rawSchema.SectionTemplate) {
    adaptedSchema.sections.push(rawSchema.SectionTemplate);
  }
  
  return adaptedSchema;
}

/**
 * In a real application, this function would extract all fields from the schema JSON
 * including any fields nested within sections and field groups
 * 
 * @param schema The schema to extract fields from
 */
export function extractAllFields(schema: any): FieldDefinition[] {
  // This would be implemented in a real app to extract all fields from the schema
  return schema.fields || [];
}
