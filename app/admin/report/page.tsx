'use client'

import { FileText, Download, AlertTriangle, UserPlus, Award, Clock } from 'lucide-react'

export default function ReportPage() {
  
  // Funzione per scaricare
  const downloadReport = (type: string) => {
    // Essendo un download file, possiamo aprire direttamente l'URL
    // Il browser gestirà il "Save As"
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api-formazione/report/export.php?type=${type}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reportistica</h1>
        <p className="text-gray-500">Esporta i dati della piattaforma in formato CSV</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Report 1: Scaduti */}
        <ReportCard 
          title="Corsi Scaduti" 
          description="Elenco dei dipendenti che non hanno completato i corsi entro la data di scadenza prevista."
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
          onClick={() => downloadReport('scaduti')}
          color="bg-red-50 border-red-100"
        />

        {/* Report 2: Non Effettuati */}
        <ReportCard 
          title="Corsi Non Completati" 
          description="Lista completa delle iscrizioni ancora aperte (in corso) con i giorni trascorsi dall'iscrizione."
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          onClick={() => downloadReport('non_effettuati')}
          color="bg-orange-50 border-orange-100"
        />

        {/* Report 3: Ultimi Iscritti */}
        <ReportCard 
          title="Nuovi Utenti (30gg)" 
          description="Lista unificata di Docenti e Dipendenti inseriti a sistema negli ultimi 30 giorni."
          icon={<UserPlus className="w-6 h-6 text-blue-600" />}
          onClick={() => downloadReport('ultimi_iscritti')}
          color="bg-blue-50 border-blue-100"
        />

        {/* Report 4: Fedeltà Docente */}
        <ReportCard 
          title="Fedeltà Docente" 
          description="Dipendenti che hanno completato almeno 3 corsi tenuti dallo stesso docente."
          icon={<Award className="w-6 h-6 text-purple-600" />}
          onClick={() => downloadReport('fedelta_docente')}
          color="bg-purple-50 border-purple-100"
        />

      </div>
    </div>
  )
}

function ReportCard({ title, description, icon, onClick, color }: any) {
  return (
    <div className={`p-6 rounded-xl border ${color} bg-white shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
          {icon}
        </div>
        <button 
          onClick={onClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Download size={16} />
          Esporta CSV
        </button>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  )
}