import React from 'react';

interface Props {
  icon?: React.ReactNode;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<Props> = ({ icon, message, action }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="text-gray-400 mb-4">
      {icon || (
        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
    </div>
    <p className="text-xl text-gray-600 mb-6">{message}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-md"
      >
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
