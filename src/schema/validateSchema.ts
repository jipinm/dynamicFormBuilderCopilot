// src/schema/validateSchema.ts
// Utility to validate the structure of a loaded schema

export function validateSchema(schema: any): { valid: boolean; errors?: string[] } {
  if (!schema) return { valid: false, errors: ['Schema is null or undefined'] };
  const requiredKeys = ['FieldDefinition', 'FieldGroupTemplate', 'SectionTemplate', 'FormTemplate'];
  const missing = requiredKeys.filter((k) => !(k in schema));
  if (missing.length > 0) {
    return { valid: false, errors: [`Missing keys: ${missing.join(', ')}`] };
  }
  // Add more detailed validation as needed
  return { valid: true };
}
