export type FieldType = 'text' | 'number' | 'select';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
}

export interface Form {
  _id: string;
  title: string;
  description?: string;
  fields: FormField[];
  shareableId: string;
  createdAt: string;
}

export interface FormResponse {
  _id: string;
  formId: string;
  answers: Record<string, string | number>;
  submittedAt: string;
}

export interface FieldAnalytic {
  fieldId: string;
  label: string;
  type: FieldType;
  totalAnswered: number;
  optionCounts?: Record<string, number>;
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
