'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
// Componenti UI
import { Button } from '@/app/components/Button'
import { Input } from '@/app/components/ui/Input'
import { Checkbox } from '@/app/components/ui/Checkbox'
import { Badge } from '@/app/components/Badge'

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Docenti</h1>
          <p className="text-gray-500">Gestione anagrafica formatori</p>
        </div>
        <Button
          onClick={() => { setEditingDocente(null); setIsModalOpen(true) }}
          icon={<Plus size={20} />}
        >
          Nuovo Docente
        </Button>
      </div>

      {/* Barra Ricerca e Tabella */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Barra Ricerca */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Input 
              placeholder="Cerca docente..." 
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
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Cognome</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Corsi</th>
                <th className="px-6 py-4 text-center">Stato</th>
                <th className="px-6 py-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center">Caricamento...</td></tr>
              ) : filteredDocenti.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Nessun docente trovato.</td></tr>
              ) : (
                filteredDocenti.map((docente) => (
                  <tr key={docente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{docente.nome}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{docente.cognome}</td>
                    <td className="px-6 py-4">{docente.email}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="blue">
                        {docente.n_corsi}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={docente.attivo == 1 ? 'success' : 'neutral'}>
                        {docente.attivo == 1 ? 'Attivo' : 'Non attivo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEditingDocente(docente); setIsModalOpen(true) }}
                          title="Modifica"
                        >
                          <Pencil size={18} className="text-gray-500" />
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(docente.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                          title="Elimina"
                        >
                          <Trash2 size={18} className="text-gray-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingDocente ? 'Modifica Docente' : 'Nuovo Docente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const payload = Object.fromEntries(formData)
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
                  <Input 
                    label="Nome *" 
                    name="nome" 
                    defaultValue={editingDocente?.nome} 
                    required 
                  />
                  <Input 
                    label="Cognome *" 
                    name="cognome" 
                    defaultValue={editingDocente?.cognome} 
                    required 
                  />
                </div>

                <Input 
                  label="Email *" 
                  type="email" 
                  name="email" 
                  defaultValue={editingDocente?.email} 
                  required 
                />

                <Input 
                  label="Titolo Professionale" 
                  name="titolo_professionale" 
                  defaultValue={editingDocente?.titolo_professionale} 
                />

                <Input 
                  label="Specializzazione" 
                  name="specializzazione" 
                  defaultValue={editingDocente?.specializzazione} 
                />

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mt-2">
                  <Checkbox 
                    id="attivo"
                    name="attivo"
                    label="Docente Attivo"
                    defaultChecked={editingDocente ? editingDocente.attivo == 1 : true} 
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit">
                  {editingDocente ? 'Aggiorna' : 'Crea'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}