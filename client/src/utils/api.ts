import axios from 'axios';
import { Form, FormResponse, AnalyticsResult } from '../types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.errors?.[0] || 'An error occurred';
    throw new Error(message);
  }
);

export const fetchForms = (): Promise<Form[]> => api.get('/forms');

export const fetchFormById = (id: string): Promise<Form> => api.get(`/forms/${id}`);

export const fetchFormByShareableId = (shareableId: string): Promise<Form> => api.get(`/forms/share/${shareableId}`);

export const createForm = (data: Omit<Form, '_id' | 'shareableId' | 'createdAt'>): Promise<Form> => api.post('/forms', data);

export const submitResponse = (formId: string, answers: Record<string, unknown>): Promise<FormResponse> => 
  api.post('/responses', { formId, answers });

export const fetchResponses = (formId: string): Promise<FormResponse[]> => api.get(`/responses/form/${formId}`);

export const fetchAnalytics = (formId: string): Promise<AnalyticsResult> => api.get(`/analytics/${formId}`);
