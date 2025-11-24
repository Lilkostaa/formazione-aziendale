import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 to-gray-50 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 rounded-full mb-6">
          <FileQuestion className="w-12 h-12 text-primary-600" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Pagina non trovata
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          La pagina che stai cercando non esiste o è stata spostata.
          Torna alla dashboard per continuare.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-black font-medium rounded-lg hover:bg-primary-700 transition-base focus-ring border-2 border-transparent hover:border-primary-700"
        >
          Torna alla Dashboard
        </Link>
      </div>
    </div>
  )
}
