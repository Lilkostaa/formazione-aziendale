import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'

interface AlertProps {
  children: ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info'
  title?: string
  onClose?: () => void
  className?: string
}

export function Alert({
  children,
  variant = 'info',
  title,
  onClose,
  className,
}: AlertProps) {
  const variants = {
    success: {
      container: 'bg-success-light border-success text-success-dark',
      icon: CheckCircle,








      
    },
    warning: {
      container: 'bg-warning-light border-warning text-warning-dark',
      icon: AlertCircle,
    },
    danger: {
      container: 'bg-danger-light border-danger text-danger-dark',
      icon: XCircle,
    },
    info: {
      container: 'bg-primary-100 border-primary-300 text-primary-800',
      icon: Info,
    },
  }

  const config = variants[variant]
  const Icon = config.icon

  return (
    <div
      className={clsx(
        'border rounded-lg p-4 flex gap-3',
        config.container,
        className
      )}
      role="alert"
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-semibold mb-1">{title}</h4>
        )}
        <div className="text-sm">{children}</div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded hover:bg-black/10 transition-base"
          aria-label="Chiudi"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
