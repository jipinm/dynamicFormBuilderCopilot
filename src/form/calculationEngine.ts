// src/form/calculationEngine.ts
// Engine for computing derived field values based on calculation rules

import type { CalculationRule } from '../types/SchemaTypes';

/**
 * Simple evaluation of a calculation rule.
 * NOTE: In a real application, you would use a more secure way to evaluate formulas
 * instead of using new Function(), which can execute arbitrary code.
 * 
 * @param rule The calculation rule to evaluate
 * @param formValues Current form values
 * @returns The calculated value, or undefined if calculation couldn't be performed
 */
export function evaluateCalculation(
  rule: CalculationRule,
  formValues: Record<string, any>
): any {
  // Check if all dependencies are available
  for (const dependency of rule.dependencies) {
    if (formValues[dependency] === undefined) {
      // Can't calculate yet, missing a dependency
      return undefined;
    }
  }
  
  try {
    // This is a simplified approach - in a real app, use a safer formula parser
    // eslint-disable-next-line no-new-func
    const evalFormula = new Function(
      ...Object.keys(formValues),
      `return ${rule.formula};`
    );
    
    return evalFormula(...Object.values(formValues));
  } catch (err) {
    console.error(`Error evaluating calculation rule (${rule.id}):`, err);
    return undefined;
  }
}

/**
 * Apply all calculation rules that have the given field as a dependency
 * 
 * @param targetField The field whose value changed
 * @param formValues Current form values
 * @param calculationRules All calculation rules in the schema
 * @returns Object with updated values from calculations
 */
export function applyCalculations(
  targetField: string,
  formValues: Record<string, any>,
  calculationRules: CalculationRule[]
): Record<string, any> {
  const updatedValues: Record<string, any> = {};
  
  // Find rules that depend on the changed field
  const relevantRules = calculationRules.filter(rule => 
    rule.dependencies.includes(targetField)
  );
  
  // Apply those rules
  for (const rule of relevantRules) {
    const calculatedValue = evaluateCalculation(rule, formValues);
    if (calculatedValue !== undefined) {
      updatedValues[rule.targetField] = calculatedValue;
    }
  }
  
  return updatedValues;
}
