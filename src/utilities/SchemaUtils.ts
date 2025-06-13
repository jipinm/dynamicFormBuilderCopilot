// src/utilities/SchemaUtils.ts
// Utilities for working with form schemas

/**
 * Find a field definition by ID in the schema
 * @param schema The form schema
 * @param fieldId The field ID to find
 */
export function findFieldDefinition(schema: any, fieldId: string) {
  if (!schema) return null;
  
  // In a complete implementation, we would search through all fields in all sections and groups
  // For example, the schema might have multiple field definitions, not just one example
  if (schema.fields && Array.isArray(schema.fields)) {
    return schema.fields.find((field: any) => field.id === fieldId);
  }
  
  // For now, we're still returning the single FieldDefinition example if it matches
  return schema.FieldDefinition?.id === fieldId ? schema.FieldDefinition : null;
}

/**
 * Find a field group template by ID in the schema
 * @param schema The form schema
 * @param groupId The group ID to find
 */
export function findFieldGroupTemplate(schema: any, groupId: string) {
  if (!schema) return null;
  
  // In a complete implementation, we would search through all groups
  if (schema.fieldGroups && Array.isArray(schema.fieldGroups)) {
    return schema.fieldGroups.find((group: any) => group.id === groupId);
  }
  
  // For now, we're still returning the single FieldGroupTemplate example if it matches
  return schema.FieldGroupTemplate?.id === groupId ? schema.FieldGroupTemplate : null;
}

/**
 * Find a section template by ID in the schema
 * @param schema The form schema
 * @param sectionId The section ID to find
 */
export function findSectionTemplate(schema: any, sectionId: string) {
  if (!schema) return null;
  
  // In a complete implementation, we would search through all sections
  if (schema.sections && Array.isArray(schema.sections)) {
    return schema.sections.find((section: any) => section.id === sectionId);
  }
  
  // For now, we're still returning the single SectionTemplate example if it matches
  return schema.SectionTemplate?.id === sectionId ? schema.SectionTemplate : null;
}

/**
 * Generate a unique field ID for form state
 * Used to distinguish between instances of repeatable field groups
 * @param fieldId Base field ID
 * @param groupId (Optional) Group ID
 * @param instanceIndex (Optional) Instance index for repeatable groups
 */
export function generateFieldStateId(fieldId: string, groupId?: string, instanceIndex?: number) {
  if (groupId && instanceIndex !== undefined && instanceIndex > 0) {
    return `${groupId}.${instanceIndex}.${fieldId}`;
  }
  if (groupId) {
    return `${groupId}.${fieldId}`;
  }
  return fieldId;
}

/**
 * Evaluate if a display rule should show a field/section/group
 * @param rule Display rule to evaluate
 * @param formState Current form state
 */
export function evaluateDisplayRule(rule: any, formState: Record<string, any>): boolean {
  if (!rule) return true;
  if (!rule.condition) return true;
  
  // Basic implementation of condition evaluation
  // In a real app, this would be much more sophisticated
  const { field, operator, value } = rule.condition;
  
  if (!field || !operator) return true;
  
  const fieldValue = formState[field];
  
  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'not_equals':
      return fieldValue !== value;
    case 'greater_than':
      return fieldValue > value;
    case 'less_than':
      return fieldValue < value;
    case 'exists':
      return fieldValue !== undefined && fieldValue !== null;
    default:
      return true;
  }
}

/**
 * Parse a form schema definition, recursively resolving references
 * @param schema The schema to parse
 */
export function parseSchema(schema: any) {
  if (!schema) return null;
  // In a real app, this would resolve references and construct a complete
  // representation of the form structure, fields, and rules
  return schema;
}
