import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Form, AnalyticsResult, FieldAnalytic } from '../../types';
import { fetchFormById, fetchAnalytics } from '../../utils/api';
import Spinner from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';

const CHART_COLORS = ['#6366f1', '#06b6d4', '#f59e0b', '#10b981', '#ef4444'];

const AnalyticsDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Form | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [formData, analyticsData] = await Promise.all([
          fetchFormById(id),
          fetchAnalytics(id)
        ]);
        setForm(formData);
        setAnalytics(analyticsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div className="max-w-7xl mx-auto p-4"><ErrorMessage message={error} /></div>;
  if (!form || !analytics) return <div className="text-center py-12">Form or Analytics not found</div>;

  if (analytics.totalSubmissions === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{form.title} Analytics</h1>
        <EmptyState 
          message="No responses yet to analyze."
          action={{
            label: "View Public Form",
            onClick: () => window.open(`${window.location.origin}/f/${form.shareableId}`, '_blank')
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
          <p className="text-gray-500 font-medium">Analytics Dashboard</p>
        </div>
        <button
          onClick={() => navigate(`/forms/${form._id}/responses`)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
        >
          View Responses
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <KPICard label="Total Responses" value={analytics.totalSubmissions} />
        <KPICard label="Fields Analyzed" value={analytics.fields.length} />
        <KPICard 
          label="Form Created" 
          value={new Date(form.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 
          isText
        />
      </div>

      <div className="space-y-8">
        <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4">Field-by-Field Breakdown</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {analytics.fields.map((field, index) => (
            <FieldAnalyticCard key={field.fieldId} field={field} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const KPICard: React.FC<{ label: string; value: number | string; isText?: boolean }> = ({ label, value, isText }) => {
  const [displayValue, setDisplayValue] = useState(isText ? value : 0);

  useEffect(() => {
    if (isText) return;
    const target = Number(value);
    if (isNaN(target)) return;
    
    let current = 0;
    const duration = 1000;
    const increment = target / (duration / 30);
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, [value, isText]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
      <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">{label}</p>
      <h3 className="text-4xl font-extrabold text-indigo-600">
        {displayValue}
      </h3>
    </div>
  );
};

const FieldAnalyticCard: React.FC<{ field: FieldAnalytic; index: number }> = React.memo(({ field, index }) => {
  const animationDelay = `${index * 100}ms`;

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-slideIn" 
      style={{ animationDelay }}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{field.label}</h3>
          <p className="text-sm text-gray-400 font-medium">{field.totalAnswered} responses collected</p>
        </div>
        <span className="px-2 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase rounded-md tracking-tighter">
          {field.type}
        </span>
      </div>

      <div className="min-h-[300px] flex items-center justify-center">
        {field.type === 'select' && <SelectChart field={field} />}
        {field.type === 'number' && <NumberChart field={field} />}
        {field.type === 'text' && (
          <div className="text-center">
            <p className="text-6xl font-black text-indigo-100 mb-2">{field.totalAnswered}</p>
            <p className="text-gray-400 font-medium">valid text responses</p>
          </div>
        )}
      </div>
    </div>
  );
});

const SelectChart: React.FC<{ field: FieldAnalytic }> = ({ field }) => {
  const pieData = useMemo(() => 
    Object.entries(field.optionCounts ?? {}).map(([name, value]) => ({ name, value })),
    [field.optionCounts]
  );

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            animationBegin={200}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const NumberChart: React.FC<{ field: FieldAnalytic }> = ({ field }) => {
  const data = useMemo(() => [{ name: 'Average', value: field.average ?? 0 }], [field.average]);

  return (
    <div className="w-full">
      <div className="h-[200px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: '#f9fafb' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar 
              dataKey="value" 
              fill="#6366f1" 
              radius={[8, 8, 0, 0]} 
              barSize={60}
              animationBegin={200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <StatPill label="Avg" value={field.average ?? 0} color="indigo" />
        <StatPill label="Min" value={field.min ?? 0} color="gray" />
        <StatPill label="Max" value={field.max ?? 0} color="gray" />
      </div>
    </div>
  );
};

const StatPill: React.FC<{ label: string; value: number; color: 'indigo' | 'gray' }> = ({ label, value, color }) => (
  <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${color === 'indigo' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
    {label}: {value}
  </div>
);

export default AnalyticsDashboardPage;
