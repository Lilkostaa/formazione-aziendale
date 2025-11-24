'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, User, BookOpen } from 'lucide-react'
// Componenti UI
import { Input } from '@/app/components/ui/Input'
import { Badge } from '@/app/components/Badge'

interface Iscrizione {
  id: number
  dipendente_nome: string
  dipendente_cognome: string
  corso_titolo: string
  data_iscrizione: string
  data_scadenza: string
  data_completamento: string | null
  durata_giorni: number
  stato: 'In corso' | 'Completato' | 'Scaduto'
}

export default function IscrizioniPage() {
  const [iscrizioni, setIscrizioni] = useState<Iscrizione[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchIscrizioni = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/iscrizioni/read.php`)
        const data = await res.json()
        setIscrizioni(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchIscrizioni()
  }, [])

  // Filtro Ricerca Multiplo
  const filtered = iscrizioni.filter(i => 
    i.dipendente_cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.dipendente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.corso_titolo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('it-IT')
  }

  // Helper per mappare lo stato al colore del Badge
  const getBadgeVariant = (stato: string) => {
    switch (stato) {
      case 'In corso': return 'blue'
      case 'Completato': return 'success'
      case 'Scaduto': return 'danger'
      default: return 'neutral'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Iscrizioni</h1>
        <p className="text-gray-500">Monitoraggio attività formative</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Input 
              placeholder="Cerca per dipendente o corso..." 
              className="pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabella */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white text-gray-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Dipendente</th>
                <th className="px-6 py-4">Corso</th>
                <th className="px-6 py-4 text-center">Data Iscrizione</th>
                <th className="px-6 py-4 text-center">Completamento</th>
                <th className="px-6 py-4 text-center">Stato</th>
                <th className="px-6 py-4 text-center">Scadenza</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center">Caricamento...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Nessuna iscrizione trovata.</td></tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{row.dipendente_cognome} {row.dipendente_nome}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">{row.corso_titolo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {formatDate(row.data_iscrizione)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.data_completamento ? (
                        <div className="flex flex-col items-center">
                          <span className="font-medium text-green-700">{formatDate(row.data_completamento)}</span>
                          <span className="text-xs text-gray-400">({row.durata_giorni} giorni)</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={getBadgeVariant(row.stato)}>
                        {row.stato}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar size={14} />
                        {formatDate(row.data_scadenza)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}