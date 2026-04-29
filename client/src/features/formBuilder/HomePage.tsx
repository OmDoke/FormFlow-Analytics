import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/formStore';
import { CardSkeleton } from '../../components/Skeleton';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { forms, loading, error, loadForms } = useFormStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  const copyToClipboard = (shareableId: string, formId: string) => {
    const url = `${window.location.origin}/f/${shareableId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(formId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) return <div className="max-w-7xl mx-auto px-4"><ErrorMessage message={error} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Dashboard</h1>
          <p className="text-gray-500 font-medium">Manage your forms and track performance</p>
        </div>
        <button
          onClick={() => navigate('/builder')}
          className="group relative px-8 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100 font-bold overflow-hidden"
        >
          <span className="relative z-10 flex items-center">
            <svg className="h-5 w-5 mr-2 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Form
          </span>
        </button>
      </div>

      {forms.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
          <EmptyState 
            message="No forms found in your account."
            action={{
              label: "Create Your First Form",
              onClick: () => navigate('/builder')
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {forms.map((form) => (
            <div 
              key={form._id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 border-l-4 border-l-indigo-500 hover:shadow-xl transition-all duration-200 group relative"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                  {form.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 h-10 leading-relaxed">
                  {form.description || 'Quickly collect and analyze data with this customizable form template.'}
                </p>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  <svg className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  {form.fields.length} Fields
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {new Date(form.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate(`/forms/${form._id}/responses`)}
                    className="px-4 py-2.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100"
                  >
                    Responses
                  </button>
                  <button
                    onClick={() => navigate(`/forms/${form._id}/analytics`)}
                    className="px-4 py-2.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100"
                  >
                    Analytics
                  </button>
                </div>
                <button
                  onClick={() => copyToClipboard(form.shareableId, form._id)}
                  className={`w-full px-4 py-2.5 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    copiedId === form._id 
                      ? 'bg-green-50 border-green-200 text-green-600' 
                      : 'bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {copiedId === form._id ? (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Share Form
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
