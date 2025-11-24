'use client'

import { Download, AlertTriangle, UserPlus, Award, Clock } from 'lucide-react'
import { Button } from '@/app/components/Button'
import { Card } from '@/app/components/Card'

export default function ReportPage() {
  
  const downloadReport = (type: string) => {
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
        
        <ReportCard 
          title="Corsi Scaduti" 
          description="Elenco dei dipendenti che non hanno completato i corsi entro la data di scadenza prevista."
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
          onDownload={() => downloadReport('scaduti')}
          iconBg="bg-red-50"
        />

        <ReportCard 
          title="Corsi Non Completati" 
          description="Lista completa delle iscrizioni ancora aperte (in corso) con i giorni trascorsi dall'iscrizione."
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          onDownload={() => downloadReport('non_effettuati')}
          iconBg="bg-orange-50"
        />

        <ReportCard 
          title="Nuovi Utenti (30gg)" 
          description="Lista unificata di Docenti e Dipendenti inseriti a sistema negli ultimi 30 giorni."
          icon={<UserPlus className="w-6 h-6 text-blue-600" />}
          onDownload={() => downloadReport('ultimi_iscritti')}
          iconBg="bg-blue-50"
        />

        <ReportCard 
          title="Fedeltà Docente" 
          description="Dipendenti che hanno completato almeno 3 corsi tenuti dallo stesso docente."
          icon={<Award className="w-6 h-6 text-purple-600" />}
          onDownload={() => downloadReport('fedelta_docente')}
          iconBg="bg-purple-50"
        />

      </div>
    </div>
  )
}

function ReportCard({ title, description, icon, onDownload, iconBg }: any) {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${iconBg}`}>
          {icon}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDownload}
          icon={<Download size={16} />}
        >
          CSV
        </Button>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed flex-1">
        {description}
      </p>
    </Card>
  )
}