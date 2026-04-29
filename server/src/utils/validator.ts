/**
 * README: Validator Utility
 * This file contains utility functions for validating form responses.
 * It checks for required fields, correct types, and valid options for select fields.
 */

import { IForm } from '../models/Form';

export const validateResponse = (form: IForm, answers: Record<string, any>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  form.fields.forEach((field) => {
    const answer = answers[field.id];

    // Check if required and missing
    const isEmpty = answer === undefined || answer === null || answer === '';
    if (field.required && isEmpty) {
      errors.push(`Field '${field.label}' is required`);
      return;
    }

    // Skip further validation if empty and not required
    if (isEmpty) return;

    // Type validation: number
    if (field.type === 'number') {
      const numValue = Number(answer);
      if (isNaN(numValue)) {
        errors.push(`Field '${field.label}' must be a number`);
      } else {
        // Specific rule for f3_rating
        if (field.id === 'f3_rating' && (numValue < 1 || numValue > 5)) {
          errors.push("Rating must be between 1 and 5");
        }
      }
    }

    // Type validation: select
    if (field.type === 'select') {
      if (field.options && !field.options.includes(String(answer))) {
        errors.push(`Invalid option for '${field.label}'`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};
