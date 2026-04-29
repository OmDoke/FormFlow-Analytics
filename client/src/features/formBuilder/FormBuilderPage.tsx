import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { FormField, FieldType } from '../../types';
import { createForm } from '../../utils/api';
import { useFormStore } from '../../store/formStore';
import ErrorMessage from '../../components/ErrorMessage';
import useDebounce from '../../hooks/useDebounce';

const FormBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { addForm } = useFormStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const [localTitle, setLocalTitle] = useState('');
  const debouncedTitle = useDebounce(localTitle, 300);

  useEffect(() => {
    setTitle(debouncedTitle);
  }, [debouncedTitle]);

  const addField = useCallback(() => {
    const newField: FormField = {
      id: uuidv4(),
      label: '',
      type: 'text',
      required: false,
      options: []
    };
    setFields(prev => [...prev, newField]);
  }, []);

  const removeField = useCallback((id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      setFields(prev => prev.filter(f => f.id !== id));
      setRemovingId(null);
    }, 200);
  }, []);

  const updateField = useCallback((index: number, key: keyof FormField, value: unknown) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, [key]: value } : f));
  }, []);

  const handleSave = async () => {
    setError(null);
    
    if (!title.trim()) {
      setError('Form title is required');
      return;
    }
    if (fields.length === 0) {
      setError('At least one field is required');
      return;
    }
    for (const field of fields) {
      if (!field.label.trim()) {
        setError(`Label for field is required`);
        return;
      }
      if (field.type === 'select' && (!field.options || field.options.length === 0)) {
        setError(`Select field "${field.label}" must have at least one option`);
        return;
      }
    }

    setIsSaving(true);
    try {
      const newForm = await createForm({ title, description, fields });
      addForm(newForm);
      navigate(`/forms/${newForm._id}/responses`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Build Your Form</h1>
        
        {error && <ErrorMessage message={error} />}

        <div className="space-y-6 mb-12">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Form Title *</label>
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              placeholder="e.g. Customer Satisfaction Survey"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this form is for..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-24 shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            Fields
            <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full font-bold">
              {fields.length}
            </span>
          </h2>
          
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div 
                key={field.id}
                className={`transition-all duration-200 ${removingId === field.id ? 'opacity-0 scale-95' : 'animate-slideIn'}`}
              >
                <FieldEditor 
                  field={field} 
                  index={index}
                  onUpdate={updateField} 
                  onRemove={removeField} 
                />
              </div>
            ))}
          </div>

          <button
            onClick={addField}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center font-bold"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Field
          </button>
        </div>

        <div className="flex justify-end pt-8 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? 'Processing...' : 'Publish Form'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface FieldEditorProps {
  field: FormField;
  index: number;
  onUpdate: (index: number, key: keyof FormField, value: unknown) => void;
  onRemove: (id: string) => void;
}

const FieldEditor: React.FC<FieldEditorProps> = React.memo(({ field, index, onUpdate, onRemove }) => {
  const [localLabel, setLocalLabel] = useState(field.label);
  const debouncedLabel = useDebounce(localLabel, 300);
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    onUpdate(index, 'label', debouncedLabel);
  }, [debouncedLabel, index, onUpdate]);

  const addOption = () => {
    if (newOption.trim()) {
      onUpdate(index, 'options', [...(field.options || []), newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (opt: string) => {
    onUpdate(index, 'options', (field.options || []).filter(o => o !== opt));
  };

  return (
    <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm relative group hover:border-indigo-100 transition-colors">
      <button
        onClick={() => onRemove(field.id)}
        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-2"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Question Label</label>
          <input
            type="text"
            value={localLabel}
            onChange={(e) => setLocalLabel(e.target.value)}
            placeholder="e.g. What is your favorite framework?"
            className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Input Type</label>
          <select
            value={field.type}
            onChange={(e) => onUpdate(index, 'type', e.target.value as FieldType)}
            className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer font-medium"
          >
            <option value="text">Short Text</option>
            <option value="number">Number</option>
            <option value="select">Dropdown / Select</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate(index, 'required', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          <span className="ml-3 text-sm font-bold text-gray-500">Required Question</span>
        </label>
      </div>

      {field.type === 'select' && (
        <div className="mt-6 p-5 bg-indigo-50/30 rounded-2xl border border-indigo-50">
          <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Choice Options</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {field.options?.map((opt, i) => (
              <span key={i} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-white text-indigo-600 border border-indigo-100 shadow-sm">
                {opt}
                <button
                  onClick={() => removeOption(opt)}
                  className="ml-2 text-indigo-300 hover:text-red-500 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add choice..."
              className="flex-1 px-4 py-2 text-sm bg-white border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium shadow-sm"
              onKeyPress={(e) => e.key === 'Enter' && addOption()}
            />
            <button
              onClick={addOption}
              className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default FormBuilderPage;
