interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // Per i bottoni d'azione (es. "Nuovo")
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      {children && (
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {children}
        </div>
      )}
    </div>
  )
}