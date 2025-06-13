// src/form/formState/FormStateContext.tsx
import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import { applyCalculations } from '../calculationEngine';
import type { CalculationRule } from '../../types/SchemaTypes';

// Types for form state
interface FormState {
  values: Record<string, any>;
  errors: Record<string, string[]>;
  touched: Record<string, boolean>;
  modified: Record<string, boolean>;
  isDirty: boolean;
  isValid: boolean;
}

// Types of actions for the reducer
type FormAction = 
  | { type: 'SET_FIELD_VALUE'; field: string; value: any }
  | { type: 'SET_FIELD_ERROR'; field: string; errors: string[] }
  | { type: 'SET_FIELD_TOUCHED'; field: string; touched: boolean }
  | { type: 'RESET_FORM' }
  | { type: 'SET_FORM_VALUES'; values: Record<string, any> }
  | { type: 'SET_CALCULATED_VALUES'; values: Record<string, any> };

// Initial state
const initialState: FormState = {
  values: {},
  errors: {},
  touched: {},
  modified: {},
  isDirty: false,
  isValid: true
};

// Reducer function to handle state updates
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value
        },
        modified: {
          ...state.modified,
          [action.field]: true
        },
        isDirty: true
      };
      
    case 'SET_FIELD_ERROR':
      const hasErrors = action.errors && action.errors.length > 0;
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.errors
        },
        isValid: !hasErrors && Object.values(state.errors)
          .filter(fieldErrors => fieldErrors !== action.errors)
          .every(fieldErrors => !fieldErrors || fieldErrors.length === 0)
      };
      
    case 'SET_FIELD_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: action.touched
        }
      };
      
    case 'RESET_FORM':
      return initialState;
      
    case 'SET_FORM_VALUES':
      return {
        ...state,
        values: action.values,
        isDirty: true
      };
      
    case 'SET_CALCULATED_VALUES':
      return {
        ...state,
        values: {
          ...state.values,
          ...action.values
        },
        isDirty: true
      };
      
    default:
      return state;
  }
}

// Context and Provider
interface FormContextType {
  formState: FormState;
  calculationRules: CalculationRule[];
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, errors: string[]) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  resetForm: () => void;
  setFormValues: (values: Record<string, any>) => void;
  setCalculationRules: (rules: CalculationRule[]) => void;
}

const FormStateContext = createContext<FormContextType | undefined>(undefined);

export const FormStateProvider = ({ children }: { children: ReactNode }) => {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [calculationRules, setCalcRules] = useReducer(
    (_state: CalculationRule[], action: CalculationRule[]) => action, 
    []
  );

  const setFieldValue = (field: string, value: any) => {
    // First update the field value
    dispatch({ type: 'SET_FIELD_VALUE', field, value });
    
    // Then apply any calculations that depend on this field
    const calculatedValues = applyCalculations(
      field,
      { ...formState.values, [field]: value },
      calculationRules
    );
    
    // Update any calculated values
    if (Object.keys(calculatedValues).length > 0) {
      dispatch({ type: 'SET_CALCULATED_VALUES', values: calculatedValues });
    }
  };

  const setCalculationRules = (rules: CalculationRule[]) => {
    setCalcRules(rules);
  };

  const setFieldError = (field: string, errors: string[]) => {
    dispatch({ type: 'SET_FIELD_ERROR', field, errors });
  };

  const setFieldTouched = (field: string, touched: boolean) => {
    dispatch({ type: 'SET_FIELD_TOUCHED', field, touched });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  const setFormValues = (values: Record<string, any>) => {
    dispatch({ type: 'SET_FORM_VALUES', values });
  };

  return (
    <FormStateContext.Provider value={{
      formState,
      calculationRules,
      setFieldValue,
      setFieldError,
      setFieldTouched,
      resetForm,
      setFormValues,
      setCalculationRules
    }}>
      {children}
    </FormStateContext.Provider>
  );
};

export const useFormState = (): FormContextType => {
  const context = useContext(FormStateContext);
  if (!context) {
    throw new Error('useFormState must be used within a FormStateProvider');
  }
  return context;
};
