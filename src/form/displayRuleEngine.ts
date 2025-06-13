// src/form/displayRuleEngine.ts
// Engine for evaluating display rules to conditionally show/hide elements

import type { DisplayRule } from '../types/SchemaTypes';
import { evaluateDisplayRule } from '../utilities/SchemaUtils';

/**
 * Determine if an element should be visible based on its display rules
 * 
 * @param displayRules The display rules to evaluate
 * @param formValues The current form values
 * @returns Boolean indicating if the element should be visible
 */
export function isVisible(
  displayRules: DisplayRule[] | undefined,
  formValues: Record<string, any>
): boolean {
  // If there are no display rules, the element is visible by default
  if (!displayRules || displayRules.length === 0) {
    return true;
  }
  
  // Evaluate each display rule
  for (const rule of displayRules) {
    // Use our existing utility to evaluate the rule condition
    const conditionMet = evaluateDisplayRule(rule, formValues);
    
    // If the condition is met and visibility is true, show the element
    if (conditionMet && rule.visible) {
      return true;
    }
    
    // If the condition is met and visibility is false, hide the element
    if (conditionMet && !rule.visible) {
      return false;
    }
  }
  
  // If no rules triggered, default to visible
  return true;
}
