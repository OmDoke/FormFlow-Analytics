import { IForm } from '../models/Form';
import { IResponse } from '../models/Response';

export interface FieldAnalytic {
  fieldId: string;
  label: string;
  type: 'text' | 'number' | 'select';
  totalAnswered: number;
  optionCounts?: Record<string, number>;
  mostSelected?: string;
  average?: number;
  min?: number;
  max?: number;
}

export interface AnalyticsResult {
  formId: string;
  formTitle: string;
  totalSubmissions: number;
  fields: FieldAnalytic[];
}

export const computeAnalytics = (form: IForm, responses: IResponse[]): AnalyticsResult => {
  const result: AnalyticsResult = {
    formId: (form._id as any).toString(),
    formTitle: form.title,
    totalSubmissions: responses.length,
    fields: []
  };

  form.fields.forEach((field) => {
    const fieldAnalytic: FieldAnalytic = {
      fieldId: field.id,
      label: field.label,
      type: field.type,
      totalAnswered: 0
    };

    const answers = responses
      .map(r => r.answers.get(field.id))
      .filter(a => a !== undefined && a !== null && a !== '');

    fieldAnalytic.totalAnswered = answers.length;

    if (field.type === 'select') {
      const counts: Record<string, number> = {};
      field.options?.forEach(opt => {
        counts[opt] = 0;
      });
      
      answers.forEach(a => {
        const strA = String(a);
        counts[strA] = (counts[strA] || 0) + 1;
      });
      
      fieldAnalytic.optionCounts = counts;

      let maxCount = -1;
      let mostSelected = '';
      Object.entries(counts).forEach(([opt, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostSelected = opt;
        }
      });
      if (maxCount > 0) {
        fieldAnalytic.mostSelected = mostSelected;
      }

    } else if (field.type === 'number' && answers.length > 0) {
      const numAnswers = answers.map(a => Number(a));
      const sum = numAnswers.reduce((acc, val) => acc + val, 0);
      fieldAnalytic.average = Math.round((sum / answers.length) * 100) / 100;
      fieldAnalytic.min = Math.min(...numAnswers);
      fieldAnalytic.max = Math.max(...numAnswers);
    }

    result.fields.push(fieldAnalytic);
  });

  return result;
};
