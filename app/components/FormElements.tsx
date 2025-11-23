import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // Per i bottoni d'azione (opzionale)
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
      {/* Sezione Testi */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-gray-500 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* Sezione Azioni (Bottoni) */}
      {children && (
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:justify-end">
          {children}
        </div>
      )}
    </div>
  )
}