interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple' | 'blue';
}

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const styles = {
    success: 'bg-green-100 text-green-800 border-green-200', // Verde
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200', // Giallo/Arancio
    danger: 'bg-red-100 text-red-800 border-red-200', // Rosso
    info: 'bg-sky-100 text-sky-800 border-sky-200', // Azzurro chiaro
    blue: 'bg-blue-100 text-blue-800 border-blue-200', // Blu standard
    purple: 'bg-purple-100 text-purple-800 border-purple-200', // Viola (Admin)
    neutral: 'bg-gray-100 text-gray-800 border-gray-200', // Grigio
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {children}
    </span>
  )
}