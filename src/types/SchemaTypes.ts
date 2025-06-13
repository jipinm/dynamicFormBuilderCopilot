// src/types/SchemaTypes.ts
// Type definitions for schema entities

export interface FieldDefinition {
  id: string;
  name: string;
  label: string;
  description?: string;
  dataType: 'string' | 'integer' | 'decimal' | 'select' | 'date';
  unit?: string | null;
  precision?: number | null;
  required: boolean;
  placeholder?: string | null;
  helpText?: string | null;
  defaultValue?: any | null;
  options?: Array<{ value: string, label: string }> | null;
  codedValue?: {
    system: string;
    code: string | null;
    display: string | null;
  } | null;
  validationRules?: Array<ValidationRule>;
  calculationRules?: Array<CalculationRule>;
  displayRules?: Array<DisplayRule>;
  dataSource?: {
    allowedSources: string[];
    deviceIntegration?: any | null;
  };
  auditMetadata?: {
    createdBy: string;
    createdAt: string;
    version: string;
    changeLog: any[];
  };
}

export interface FieldGroupTemplate {
  id: string;
  name: string;
  description?: string;
  repeatable: boolean;
  maxInstances: number;
  minInstances: number;
  fields: string[];
  displayRules?: Array<DisplayRule>;
  validationRules?: Array<ValidationRule>;
  calculationRules?: Array<CalculationRule>;
}

export interface SectionTemplate {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  collapsible: boolean;
  defaultExpanded: boolean;
  fieldGroups: string[];
  individualFields: string[];
  displayRules?: Array<DisplayRule>;
  completionRules?: {
    requiredFieldGroups: string[];
    requiredFields: string[];
    validationLevel: 'error' | 'warning';
  };
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  version: string;
  category: string;
  estimatedDuration?: number;
  sections: Array<{
    sectionId: string;
    displayOrder: number;
    required: boolean;
  }>;
  displayRules?: Array<DisplayRule>;
  completionRules?: {
    requiredSections: string[];
    allowPartialSave: boolean;
    autoSaveInterval?: number;
  };
  navigationRules?: {
    allowBackNavigation: boolean;
    showProgressIndicator: boolean;
    skipLogic: Array<{
      condition: Condition;
      skipSection: string;
    }>;
  };
  attachments?: {
    allowedTypes: string[];
    maxFileSize: string;
    maxTotalSize: string;
  };
}

export interface ValidationRule {
  id: string;
  type: 'range' | 'pattern' | 'required' | 'cross_field';
  min?: number;
  max?: number;
  pattern?: string;
  condition?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface CalculationRule {
  id: string;
  targetField: string;
  formula: string;
  dependencies: string[];
}

export interface DisplayRule {
  condition: Condition;
  visible: boolean;
}

export interface Condition {
  field?: string;
  operator?: string;
  value?: any;
  studyEvent?: string;
  patientAge?: {
    operator: string;
    value: number;
  };
}

export interface Schema {
  schemaVersion: string;
  description?: string;
  note?: string;
  // The original template examples from the JSON files
  FieldDefinition: FieldDefinition;
  FieldGroupTemplate: FieldGroupTemplate;
  SectionTemplate: SectionTemplate;
  FormTemplate: FormTemplate;
  // Adapted arrays for our application's use
  fields: FieldDefinition[];
  fieldGroups: FieldGroupTemplate[];
  sections: SectionTemplate[];
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string[]>;
  visited: Record<string, boolean>;
  modified: Record<string, boolean>;
}
