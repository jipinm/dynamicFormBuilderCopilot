// src/form/validationEngine.ts
// Validation engine for evaluating schema validation rules

import type { FieldDefinition, ValidationRule } from '../types/SchemaTypes';

/**
 * Validate a field value against a validation rule
 * @param value The field value to validate
 * @param rule The validation rule to apply
 * @param formValues All form values (for cross-field validation)
 * @returns An array of error messages (empty if validation passes)
 */
export function validateField(
  value: any,
  rule: ValidationRule,
  formValues?: Record<string, any>
): string[] {
  const errors: string[] = [];

  switch (rule.type) {
    case 'range':
      // Check if value is within the specified range
      if (value !== null && value !== undefined && value !== '') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          if (rule.min !== undefined && numValue < rule.min) {
            errors.push(rule.message);
          }
          if (rule.max !== undefined && numValue > rule.max) {
            errors.push(rule.message);
          }
        }
      }
      break;
      
    case 'pattern':
      // Check if value matches the regex pattern
      if (value && rule.pattern) {
        const regex = new RegExp(rule.pattern);
        if (!regex.test(String(value))) {
          errors.push(rule.message);
        }
      }
      break;
      
    case 'required':
      // Check if required value is provided
      if (value === undefined || value === null || value === '') {
        errors.push(rule.message);
      }
      break;
      
    case 'cross_field':
      // Evaluate a condition involving multiple fields
      // This is simplified - in a real app, you'd need a proper condition evaluator
      if (rule.condition && formValues) {
        try {
          // IMPORTANT: This is a simplified implementation for demo purposes only
          // In a real app, you would need a more secure way to evaluate expressions
          // eslint-disable-next-line no-new-func
          const evalCondition = new Function(
            ...Object.keys(formValues),
            `return ${rule.condition};`
          );
          
          const result = evalCondition(...Object.values(formValues));
          if (!result) {
            errors.push(rule.message);
          }
        } catch (err) {
          console.error('Error evaluating validation condition:', err);
        }
      }
      break;
      
    default:
      // Unknown rule type
      console.warn(`Unknown validation rule type: ${(rule as any).type}`);
  }

  return errors;
}

/**
 * Validate a field against all of its validation rules
 * @param fieldDefinition The field definition containing validation rules
 * @param value The field value
 * @param formValues All form values (for cross-field validation)
 * @returns An array of validation error messages
 */
export function validateFieldAgainstRules(
  fieldDefinition: FieldDefinition,
  value: any,
  formValues?: Record<string, any>
): string[] {
  const errors: string[] = [];
  
  // If field is required, add a required validation rule
  if (fieldDefinition.required && !fieldDefinition.validationRules?.some(rule => rule.type === 'required')) {
    errors.push(...validateField(value, {
      id: 'implicit_required',
      type: 'required',
      message: `${fieldDefinition.label} is required`,
      severity: 'error'
    }));
  }
  
  // Apply all validation rules
  if (fieldDefinition.validationRules) {
    for (const rule of fieldDefinition.validationRules) {
      errors.push(...validateField(value, rule, formValues));
    }
  }
  
  return errors;
}
