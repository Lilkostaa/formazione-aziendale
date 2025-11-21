'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

interface Docente {
  id: number
  nome: string
  cognome: string
  email: string
  titolo_professionale: string
  specializzazione: string
  attivo: number // 1 o 0
  n_corsi: number
}

export default function DocentiPage() {
  const [docenti, setDocenti] = useState<Docente[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDocente, setEditingDocente] = useState<Docente | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch Docenti
  const fetchDocenti = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/docenti/read.php`)
      const data = await res.json()
      setDocenti(data)
    } catch (error) {
      console.error('Errore caricamento docenti:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocenti()
  }, [])

  // Gestione Eliminazione
  const handleDelete = async (id: number) => {
    if (!confirm('Sei sicuro di voler eliminare questo docente?')) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/docenti/delete.php`, {
        method: 'POST',
        body: JSON.stringify({ id }),
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      alert('Docente eliminato!')
      fetchDocenti()
    } catch (error: any) {
      alert(error.message)
    }
  }

  // Filtro ricerca
  const filteredDocenti = docenti.filter(d => 
    d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.cognome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Pagina */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Docenti</h1>
          <p className="text-gray-500">Gestione anagrafica formatori</p>
        </div>
        <button
          onClick={() => { setEditingDocente(null); setIsModalOpen(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> Nuovo Docente
        </button>
      </div>

      {/* Barra Ricerca e Tabella */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Barra Ricerca */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Cerca docente..." 
              className="pl-10 w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabella */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Cognome</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Corsi</th>
                <th className="px-6 py-4 text-center">Stato</th>
                <th className="px-6 py-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center">Caricamento...</td></tr>
              ) : filteredDocenti.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center">Nessun docente trovato.</td></tr>
              ) : (
                filteredDocenti.map((docente) => (
                  <tr key={docente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{docente.nome}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{docente.cognome}</td>
                    <td className="px-6 py-4">{docente.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {docente.n_corsi}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {docente.attivo == 1 ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                          Attivo
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                          Non attivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => { setEditingDocente(docente); setIsModalOpen(true) }}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(docente.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale Form (Componente interno per semplicità) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {editingDocente ? 'Modifica Docente' : 'Nuovo Docente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const payload = Object.fromEntries(formData)
              // Converti checkbox attivo
              payload.attivo = formData.get('attivo') ? '1' : '0'
              if (editingDocente) payload.id = editingDocente.id.toString()

              const endpoint = editingDocente ? 'update.php' : 'create.php'
              
              try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/docenti/${endpoint}`, {
                  method: 'POST',
                  body: JSON.stringify(payload),
                })
                if (!res.ok) throw new Error('Errore salvataggio')
                
                fetchDocenti()
                setIsModalOpen(false)
              } catch (err) {
                alert('Errore durante il salvataggio')
              }
            }}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                    <input name="nome" defaultValue={editingDocente?.nome} required className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cognome *</label>
                    <input name="cognome" defaultValue={editingDocente?.cognome} required className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" name="email" defaultValue={editingDocente?.email} required className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titolo Professionale</label>
                  <input name="titolo_professionale" defaultValue={editingDocente?.titolo_professionale} className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specializzazione</label>
                  <input name="specializzazione" defaultValue={editingDocente?.specializzazione} className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="attivo" 
                    name="attivo" 
                    defaultChecked={editingDocente ? editingDocente.attivo == 1 : true} 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="attivo" className="text-sm text-gray-700">Docente Attivo</label>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Annulla</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Salva</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}