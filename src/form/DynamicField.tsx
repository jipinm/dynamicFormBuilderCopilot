// src/form/DynamicField.tsx
import { useSchema } from '../schema/SchemaContext';
import type { FieldDefinition } from '../types/SchemaTypes';
import { findFieldDefinition, generateFieldStateId } from '../utilities/SchemaUtils';
import { useFormState } from './formState/FormStateContext';
import { validateFieldAgainstRules } from './validationEngine';
import { createFieldByType } from './fieldFactory';
import { useEffect } from 'react';
import { isVisible } from './displayRuleEngine';

interface DynamicFieldProps {
  fieldId: string;
  instanceIndex?: number;
  groupId?: string;
}

export default function DynamicField({ 
  fieldId, 
  instanceIndex = 0,
  groupId 
}: DynamicFieldProps) {
  const { schema } = useSchema();
  const { formState, setFieldValue, setFieldTouched, setFieldError } = useFormState();
  
  if (!schema) return null;
  
  const fieldDefinition = findFieldDefinition(schema, fieldId) as FieldDefinition | null;
  if (!fieldDefinition) {
    console.warn(`Field with ID ${fieldId} not found in schema`);
    return null;
  }

  // Check display rules for visibility
  const shouldShowField = isVisible(fieldDefinition.displayRules, formState.values);
  if (!shouldShowField) {
    // Don't render the field if it shouldn't be visible
    return null;
  }

  // Generate unique field ID for form state (to handle repeated fields in groups)
  const uniqueFieldId = generateFieldStateId(fieldId, groupId, instanceIndex);
  
  // Initialize field with default value if not already set
  useEffect(() => {
    if (fieldDefinition.defaultValue !== undefined && fieldDefinition.defaultValue !== null &&
        formState.values[uniqueFieldId] === undefined) {
      setFieldValue(uniqueFieldId, fieldDefinition.defaultValue);
    }
  }, []);
  
  const value = formState.values[uniqueFieldId] || '';
  const errors = formState.errors[uniqueFieldId] || [];
  const touched = formState.touched[uniqueFieldId] || false;
    // Default handler for input changes
  const handleChange = (newValue: any) => {
    console.log(`Field changed: ${uniqueFieldId}`, newValue);
    setFieldValue(uniqueFieldId, newValue);
  };
  
  const handleBlur = () => {
    console.log(`Field blurred: ${uniqueFieldId}`);
    setFieldTouched(uniqueFieldId, true);
    
    // Validate on blur
    const validationErrors = validateFieldAgainstRules(
      fieldDefinition, 
      formState.values[uniqueFieldId],
      formState.values
    );
    setFieldError(uniqueFieldId, validationErrors);
  };
  
  // Validate on mount and when value changes
  useEffect(() => {
    if (touched) {
      const validationErrors = validateFieldAgainstRules(
        fieldDefinition,
        value,
        formState.values
      );
      setFieldError(uniqueFieldId, validationErrors);
    }
  }, [value, touched]);

  // Render the field using the factory
  const renderField = () => {
    const {
      dataType,
      required,
      placeholder,
      helpText,
    } = fieldDefinition;

    const commonProps = {
      id: uniqueFieldId,
      name: uniqueFieldId,
      required,
      placeholder: placeholder || undefined,
      value: value,
      onChange: handleChange,
      onBlur: handleBlur,
      'aria-describedby': helpText ? `${uniqueFieldId}-help` : undefined
    };

    return createFieldByType(dataType, fieldDefinition, commonProps);
  };

  return (
    <div className="form-field" data-field-id={fieldId}>
      <label htmlFor={uniqueFieldId}>
        {fieldDefinition.label}
        {fieldDefinition.required && <span className="required-indicator">*</span>}
      </label>
      
      {renderField()}
      
      {fieldDefinition.helpText && (
        <div id={`${uniqueFieldId}-help`} className="field-help-text">
          {fieldDefinition.helpText}
        </div>
      )}
      
      {fieldDefinition.unit && (
        <span className="field-unit">{fieldDefinition.unit}</span>
      )}
      
      {touched && errors.length > 0 && (
        <div className="field-errors">
          {errors.map((error, i) => (
            <div key={i} className="field-error">{error}</div>
          ))}
        </div>
      )}
    </div>
  );
}
