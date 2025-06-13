// src/form/DynamicFieldGroup.tsx
import { useState } from 'react';
import { useSchema } from '../schema/SchemaContext';
import type { FieldGroupTemplate } from '../types/SchemaTypes';
import DynamicField from './DynamicField';
import { findFieldGroupTemplate } from '../utilities/SchemaUtils';
import { useFormState } from './formState/FormStateContext';
import { isVisible } from './displayRuleEngine';

interface DynamicFieldGroupProps {
  groupId: string;
}

export default function DynamicFieldGroup({ groupId }: DynamicFieldGroupProps) {
  const { schema } = useSchema();
  const { formState } = useFormState();
  const [instances, setInstances] = useState<number[]>([0]); // Default to 1 instance (index 0)
  
  if (!schema) return null;
  
  const groupTemplate = findFieldGroupTemplate(schema, groupId) as FieldGroupTemplate | null;
  if (!groupTemplate) {
    console.warn(`Field group with ID ${groupId} not found in schema`);
    return null;
  }

  // Check display rules for visibility
  const shouldShowGroup = isVisible(groupTemplate.displayRules, formState.values);
  if (!shouldShowGroup) {
    // Don't render the group if it shouldn't be visible
    return null;
  }

  const { name, description, repeatable, maxInstances, minInstances, fields } = groupTemplate;

  const addInstance = () => {
    if (instances.length < maxInstances) {
      setInstances([...instances, instances.length]);
    }
  };

  const removeInstance = (index: number) => {
    if (instances.length > minInstances) {
      setInstances(instances.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="field-group" data-group-id={groupId}>
      <div className="group-header">
        <h4>{name}</h4>
        {description && <div className="group-description">{description}</div>}
      </div>
      
      {instances.map((instanceIndex) => (
        <div key={instanceIndex} className="group-instance">
          {instanceIndex > 0 && <hr className="instance-separator" />}
          
          {fields.map(fieldId => (
            <DynamicField 
              key={`${fieldId}-${instanceIndex}`} 
              fieldId={fieldId} 
              instanceIndex={instanceIndex} 
            />
          ))}
          
          {repeatable && instances.length > minInstances && (
            <button 
              type="button" 
              className="remove-instance-btn" 
              onClick={() => removeInstance(instanceIndex)}
            >
              Remove
            </button>
          )}
        </div>
      ))}
      
      {repeatable && instances.length < maxInstances && (
        <button 
          type="button" 
          className="add-instance-btn" 
          onClick={addInstance}
        >
          Add {name}
        </button>
      )}
    </div>
  );
}
