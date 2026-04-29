import { IForm } from '../models/Form';

export const validateResponse = (form: IForm, answers: Record<string, any>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  form.fields.forEach((field) => {
    const answer = answers[field.id];

    const isEmpty = answer === undefined || answer === null || answer === '';
    if (field.required && isEmpty) {
      errors.push(`Field '${field.label}' is required`);
      return;
    }

    if (isEmpty) return;

    if (field.type === 'number') {
      const numValue = Number(answer);
      if (isNaN(numValue)) {
        errors.push(`Field '${field.label}' must be a number`);
      } else {
        if (field.id === 'f3_rating' && (numValue < 1 || numValue > 5)) {
          errors.push("Rating must be between 1 and 5");
        }
      }
    }

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
