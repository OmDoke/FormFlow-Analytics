import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form } from '../../types';
import { fetchFormByShareableId, submitResponse } from '../../utils/api';
import Spinner from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';

const PublicFormPage: React.FC = () => {
  const { shareableId } = useParams<{ shareableId: string }>();
  const navigate = useNavigate();
  
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      if (!shareableId) return;
      try {
        const data = await fetchFormByShareableId(shareableId);
        setForm(data);
      } catch (err: any) {
        setServerError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadForm();
  }, [shareableId]);

  const handleInputChange = (fieldId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validate = () => {
    if (!form) return false;
    const newErrors: Record<string, string> = {};
    
    form.fields.forEach(field => {
      const val = answers[field.id];
      if (field.required && (val === undefined || val === null || val === '')) {
        newErrors[field.id] = 'This field is required';
      }
      if (field.type === 'number' && val !== undefined && val !== '' && isNaN(Number(val))) {
        newErrors[field.id] = 'Please enter a valid number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !validate()) return;

    setSubmitting(true);
    setServerError(null);
    try {
      await submitResponse(form._id, answers);
      setSubmitted(true);
    } catch (err: any) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setAnswers({});
    setErrors({});
    setSubmitted(false);
    setServerError(null);
  };

  if (loading) return <Spinner />;
  if (serverError && !form) return <div className="max-w-2xl mx-auto p-4"><ErrorMessage message={serverError} /></div>;
  if (!form) return <div className="text-center py-12">Form not found</div>;

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center p-4 animate-fadeIn">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <svg className="h-12 w-12 animate-slideIn" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Thank you for your response!</h2>
          <p className="text-gray-500 mb-10 text-lg font-medium leading-relaxed">Your feedback has been recorded successfully and sent to the administrator.</p>
          <div className="flex flex-col gap-4">
            <button
              onClick={resetForm}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Submit Another Response
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-start animate-fadeIn">
      <form onSubmit={handleSubmit} className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-600 px-10 py-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <h1 className="text-4xl font-black mb-3 relative z-10">{form.title}</h1>
          {form.description && <p className="text-indigo-100 font-medium opacity-90 relative z-10 leading-relaxed">{form.description}</p>}
        </div>

        <div className="p-10 space-y-10">
          {serverError && <ErrorMessage message={serverError} />}
          
          {form.fields.map((field) => (
            <div key={field.id} className="space-y-3">
              <label className="block text-sm font-black text-gray-700 tracking-wide uppercase">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  className={`w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium ${errors[field.id] ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="Type your answer here..."
                  value={answers[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  className={`w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium ${errors[field.id] ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="0"
                  value={answers[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              )}

              {field.type === 'select' && (
                <select
                  className={`w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer font-medium appearance-none ${errors[field.id] ? 'ring-2 ring-red-500' : ''}`}
                  value={answers[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                >
                  <option value="">Choose an option...</option>
                  {field.options?.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {errors[field.id] && (
                <p className="text-xs font-black text-red-500 mt-2 flex items-center">
                  <svg className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}

          <div className="pt-8">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Submit Response'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PublicFormPage;
