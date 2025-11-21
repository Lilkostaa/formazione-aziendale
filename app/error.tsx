'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log errore a servizio di monitoring (es. Sentry)
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-danger-light rounded-full mb-6">
          <AlertCircle className="w-10 h-10 text-danger" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Qualcosa è andato storto
        </h2>
        <p className="text-gray-600 mb-6">
          Si è verificato un errore imprevisto. Riprova o contatta l'assistenza se il problema persiste.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
            <p className="text-xs font-mono text-gray-700">
              {error.message}
            </p>
          </div>
        )}
        
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-base focus-ring"
        >
          Riprova
        </button>
      </div>
    </div>
  )
}
