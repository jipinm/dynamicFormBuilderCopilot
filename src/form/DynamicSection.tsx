// src/form/DynamicSection.tsx
import { useSchema } from '../schema/SchemaContext';
import type { SectionTemplate } from '../types/SchemaTypes';
import DynamicFieldGroup from './DynamicFieldGroup';
import DynamicField from './DynamicField';
import { findSectionTemplate } from '../utilities/SchemaUtils';
import { useState } from 'react';
import { useFormState } from './formState/FormStateContext';
import { isVisible } from './displayRuleEngine';

interface DynamicSectionProps {
  sectionId: string;
  required: boolean;
}

export default function DynamicSection({ sectionId, required }: DynamicSectionProps) {
  const { schema } = useSchema();
  const { formState } = useFormState();
  
  if (!schema) return null;

  const sectionTemplate = findSectionTemplate(schema, sectionId) as SectionTemplate | null;
  if (!sectionTemplate) {
    console.warn(`Section with ID ${sectionId} not found in schema`);
    return null;
  }

  // Check display rules for visibility
  const shouldShowSection = isVisible(sectionTemplate.displayRules, formState.values);
  if (!shouldShowSection) {
    // Don't render the section if it shouldn't be visible
    return null;
  }

  const { name, description, collapsible, defaultExpanded, fieldGroups, individualFields } = sectionTemplate;
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded); // Use defaultExpanded from schema

  const toggleCollapse = () => {
    if (collapsible) {
      setExpanded(!expanded);
    }
  };

  return (
    <div className="form-section" data-section-id={sectionId}>
      <div className={`section-header ${collapsible ? 'collapsible' : ''}`} 
           onClick={toggleCollapse} 
           style={{ cursor: collapsible ? 'pointer' : 'default' }}>
        <h3>
          {collapsible && (
            <span className="collapse-indicator">
              {expanded ? '▼' : '►'}
            </span>
          )}
          {name} {required && <span className="required-indicator">*</span>}
        </h3>
        {description && <div className="section-description">{description}</div>}
      </div>
      
      <div className="section-content" style={{ display: expanded ? 'block' : 'none' }}>
        {fieldGroups.map(groupId => (
          <DynamicFieldGroup key={groupId} groupId={groupId} />
        ))}
        
        {individualFields.map(fieldId => (
          <DynamicField key={fieldId} fieldId={fieldId} />
        ))}
      </div>
    </div>
  );
}
