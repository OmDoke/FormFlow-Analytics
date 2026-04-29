import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-100 rounded w-5/6 mb-6"></div>
    <div className="flex justify-between items-center mb-6">
      <div className="h-4 bg-gray-100 rounded w-1/4"></div>
      <div className="h-4 bg-gray-100 rounded w-1/4"></div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="h-8 bg-gray-100 rounded"></div>
      <div className="h-8 bg-gray-100 rounded"></div>
    </div>
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-12 bg-gray-50 border-b border-gray-100"></div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-16 border-b border-gray-50 flex items-center px-6 gap-4">
        <div className="h-4 bg-gray-100 rounded w-8"></div>
        <div className="h-4 bg-gray-100 rounded flex-1"></div>
        <div className="h-4 bg-gray-100 rounded flex-1"></div>
        <div className="h-4 bg-gray-100 rounded w-32"></div>
      </div>
    ))}
  </div>
);
