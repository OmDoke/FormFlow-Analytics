import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, FormResponse } from '../../types';
import { fetchFormById, fetchResponses } from '../../utils/api';
import { TableSkeleton } from '../../components/Skeleton';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';

const ResponseViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [formData, responsesData] = await Promise.all([
          fetchFormById(id),
          fetchResponses(id)
        ]);
        setForm(formData);
        setResponses(responsesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Memoize columns to prevent re-renders
  const columns = useMemo(() => {
    if (!form) return [];
    return form.fields.map(field => ({
      id: field.id,
      label: field.label
    }));
  }, [form]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded w-1/4 mb-10 animate-pulse"></div>
        <TableSkeleton />
      </div>
    );
  }

  if (error) return <div className="max-w-7xl mx-auto p-4"><ErrorMessage message={error} /></div>;
  if (!form) return <div className="text-center py-12">Form not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <nav className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-4">
            <Link to="/" className="hover:text-indigo-800 flex items-center transition-colors">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              Dashboard
            </Link>
          </nav>
          <h1 className="text-4xl font-black text-gray-900 mb-2">{form.title}</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            Submission Log • {responses.length} entries
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/forms/${form._id}/analytics`)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </button>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-20 px-8">
          <EmptyState 
            message="No data has been collected yet."
            action={{
              label: "Copy Shareable Link",
              onClick: () => {
                const url = `${window.location.origin}/f/${form.shareableId}`;
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
              }
            }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No.</th>
                  {columns.map(col => (
                    <th key={col.id} className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] min-w-[200px]">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] min-w-[200px]">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {responses.map((response, idx) => (
                  <tr key={response._id} className="hover:bg-indigo-50/20 transition-colors group">
                    <td className="px-8 py-6 text-sm text-gray-300 font-black group-hover:text-indigo-400">{responses.length - idx}</td>
                    {columns.map(col => (
                      <td key={col.id} className="px-8 py-6 text-sm text-gray-600 font-medium">
                        {response.answers[col.id] !== undefined ? (
                          <span className="bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                            {String(response.answers[col.id])}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    ))}
                    <td className="px-8 py-6 text-xs text-gray-400 font-bold italic">
                      {formatDate(response.submittedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseViewerPage;
