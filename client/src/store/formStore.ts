import { create } from 'zustand';
import { Form } from '../types';
import * as api from '../utils/api';

interface FormState {
  forms: Form[];
  loading: boolean;
  error: string | null;
  loadForms: () => Promise<void>;
  refreshForms: () => Promise<void>;
  addForm: (form: Form) => void;
}

const CACHE_KEY = 'formbuilder_forms_cache';
const CACHE_EXPIRY = 5 * 60 * 1000;

export const useFormStore = create<FormState>((set, get) => ({
  forms: [],
  loading: false,
  error: null,

  loadForms: async () => {
    const { forms } = get();
    
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        if (forms.length === 0) {
          set({ forms: data, loading: false, error: null });
        }
        return;
      }
    }

    await get().refreshForms();
  },

  refreshForms: async () => {
    set({ loading: true, error: null });
    try {
      const forms = await api.fetchForms();
      set({ forms, loading: false });
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: forms, timestamp: Date.now() }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addForm: (form) => {
    const newForms = [form, ...get().forms];
    set({ forms: newForms });
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: newForms, timestamp: Date.now() }));
  }
}));
