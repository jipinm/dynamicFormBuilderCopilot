// src/form/fieldFactory.ts
// Factory for creating field components based on field type

import type { FieldDefinition } from '../types/SchemaTypes';
import { createElement } from 'react';

/**
 * Render an input field based on its data type
 * @param dataType The field's data type
 * @param fieldDefinition The complete field definition
 * @param props Common props for the input element
 * @returns A React element for the field
 */
export function createFieldByType(
  dataType: string,
  fieldDefinition: FieldDefinition,
  props: any
) {
  // Extract onChange from props to handle separately
  const { onChange, ...restProps } = props;
  
  switch (dataType) {
    case 'string':
      return createElement("input", { 
        type: "text", 
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
        ...restProps 
      });
      
    case 'integer':
      return createElement("input", { 
        type: "number", 
        step: "1", 
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value ? parseInt(e.target.value, 10) : "";
          onChange(value);
        },
        ...restProps 
      });
      
    case 'decimal': {
      const step = fieldDefinition.precision
        ? `0.${'0'.repeat(fieldDefinition.precision-1)}1`
        : "0.01";
      return createElement("input", { 
        type: "number", 
        step, 
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value ? parseFloat(e.target.value) : "";
          onChange(value);
        },
        ...restProps 
      });
    }
      
    case 'select':
      return createElement(
        "select",
        { 
          ...restProps,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)
        },
        createElement("option", { value: "" }, "-- Select --"),
        ...(fieldDefinition.options?.map(option => 
          createElement("option", { key: option.value, value: option.value }, option.label)
        ) || [])
      );
      
    case 'date':
      return createElement("input", { 
        type: "date", 
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
        ...restProps 
      });

    // Additional types could be added here
    case 'textarea':
      return createElement("textarea", { 
        rows: 4, 
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value),
        ...restProps 
      });
      
    case 'checkbox':
      return createElement("input", { 
        type: "checkbox",
        checked: props.value === true,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked),
        ...restProps 
      });
      
    case 'radio': {
      const options = fieldDefinition.options?.map(option => 
        createElement("label", { key: option.value, className: "radio-option" },
          createElement("input", {
            type: "radio",
            value: option.value,
            checked: props.value === option.value,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
            name: restProps.name
          }),
          createElement("span", null, option.label)
        )
      );
      return createElement("div", { className: "radio-group" }, ...(options || []));
    }
      
    default:
      return createElement("div", null, `Unsupported field type: ${dataType}`);
  }
}
