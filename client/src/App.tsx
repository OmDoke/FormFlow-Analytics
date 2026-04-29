import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './features/formBuilder/HomePage';
import FormBuilderPage from './features/formBuilder/FormBuilderPage';
import PublicFormPage from './features/formRenderer/PublicFormPage';
import ResponseViewerPage from './features/responseViewer/ResponseViewerPage';
import AnalyticsDashboardPage from './features/analytics/AnalyticsDashboardPage';

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`relative px-1 pt-1 text-sm font-bold transition-colors ${
        isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full transition-all duration-300"></span>
      )}
    </Link>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-['Inter']">
        <NavWrapper />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/builder" element={<FormBuilderPage />} />
            <Route path="/builder/:id" element={<FormBuilderPage />} />
            <Route path="/forms/:id/responses" element={<ResponseViewerPage />} />
            <Route path="/forms/:id/analytics" element={<AnalyticsDashboardPage />} />
            <Route path="/f/:shareableId" element={<PublicFormPage />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-gray-100 py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-gray-400">
              FormFlow
            </span>
            <p className="text-gray-300 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
              Analytics-Powered Data Collection
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

const NavWrapper: React.FC = () => {
  const location = useLocation();
  const isPublicPage = location.pathname.startsWith('/f/');

  if (isPublicPage) return null;

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all shadow-xl shadow-indigo-100">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
                FormFlow
              </span>
            </Link>
            <div className="hidden md:ml-12 md:flex md:space-x-10">
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/builder">Builder</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-black text-gray-900 leading-none">Admin User</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Premium Plan</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs shadow-inner">
              AU
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default App;
