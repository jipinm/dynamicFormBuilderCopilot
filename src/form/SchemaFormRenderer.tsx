// src/form/SchemaFormRenderer.tsx
import { useSchema } from '../schema/SchemaContext';
import type { FormTemplate, CalculationRule } from '../types/SchemaTypes';
import DynamicSection from './DynamicSection';
import { useFormState } from './formState/FormStateContext';
import { useEffect } from 'react';

interface SchemaFormRendererProps {
  formData?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void;
  onSave?: (values: Record<string, any>) => void;
}

export default function SchemaFormRenderer({ formData, onSubmit, onSave }: SchemaFormRendererProps) {
  const { schema, loading, error } = useSchema();
  const { formState, setFormValues, setCalculationRules } = useFormState();
  
  // Initialize form with provided data when it changes
  useEffect(() => {
    if (formData) {
      setFormValues(formData);
    }
  }, [formData]);
  
  // Collect all calculation rules from the schema
  useEffect(() => {
    if (schema) {
      // In a real app, we would collect rules from all fields
      // For now we just use the example field's rules if any
      const rules: CalculationRule[] = [];
      
      // Add rules from the FieldDefinition
      if (schema.FieldDefinition?.calculationRules) {
        rules.push(...schema.FieldDefinition.calculationRules);
      }
      
      // Add rules from the FieldGroupTemplate
      if (schema.FieldGroupTemplate?.calculationRules) {
        rules.push(...schema.FieldGroupTemplate.calculationRules);
      }
      
      // Set the collected rules
      setCalculationRules(rules);
    }
  }, [schema]);

  if (loading) return <div>Loading schema...</div>;
  if (error) return <div>Error loading schema: {error}</div>;
  if (!schema) return <div>No schema loaded</div>;

  const formTemplate: FormTemplate = schema.FormTemplate;
  
  // Sort sections by displayOrder
  const sortedSections = [...formTemplate.sections].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formState.values);
  };

  return (
    <div className="schema-form">
      <h2>{formTemplate.name}</h2>
      {formTemplate.description && <p>{formTemplate.description}</p>}
      
      <form onSubmit={handleSubmit}>
        {sortedSections.map((sectionConfig) => (
          <DynamicSection 
            key={sectionConfig.sectionId}
            sectionId={sectionConfig.sectionId}
            required={sectionConfig.required}
          />
        ))}
        
        <div className="form-actions">
          {onSave && (
            <button 
              type="button" 
              onClick={() => onSave(formState.values)}
              disabled={!formState.isDirty}
            >
              Save Draft
            </button>
          )}
          <button 
            type="submit"
            disabled={!formState.isValid}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
