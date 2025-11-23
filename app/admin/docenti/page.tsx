'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import type { Docente } from '@/types' 
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/Button'
import { Badge } from '../../components/Badge'
import { Modal } from '../../components/Modal'

interface DocenteRow extends Docente {
  n_corsi: number
}

export default function DocentiPage() {
  // Stati
  const [docenti, setDocenti] = useState<DocenteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDocente, setEditingDocente] = useState<Docente | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Funzione per caricare i dati
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

  // Caricamento iniziale
  useEffect(() => {
    fetchDocenti()
  }, [])

  // Gestione Eliminazione
  const handleDelete = async (id: number) => {
    if (!confirm('Sei sicuro di voler eliminare questo docente?')) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/docenti/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  // Gestione Salvataggio (Creazione / Modifica)
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const payload = Object.fromEntries(formData)
    
    // Gestione checkbox "attivo" e conversione in formato atteso dal PHP (1 o 0)
    payload.attivo = formData.get('attivo') ? '1' : '0'
    
    if (editingDocente) {
      payload.id = editingDocente.id.toString()
    }

    const endpoint = editingDocente ? 'update.php' : 'create.php'
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/docenti/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if (!res.ok) throw new Error('Errore durante il salvataggio')
      
      fetchDocenti()
      setIsModalOpen(false)
    } catch (err) {
      alert('Errore durante il salvataggio')
    }
  }

  // Filtro ricerca locale
  const filteredDocenti = docenti.filter(d => 
    d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      
      {/* HEADER PAGINA */}
      <PageHeader 
        title="Docenti" 
        description="Gestione anagrafica formatori"
      >
        <Button 
          onClick={() => { setEditingDocente(null); setIsModalOpen(true) }}
          icon={<Plus size={20} />}
        >
          Nuovo Docente
        </Button>
      </PageHeader>

      {/* CARD TABELLA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* BARRA DI RICERCA */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Cerca per nome, cognome o email..." 
              className="pl-10 w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TABELLA DATI */}
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
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Caricamento in corso...</td></tr>
              ) : filteredDocenti.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Nessun docente trovato.</td></tr>
              ) : (
                filteredDocenti.map((docente) => (
                  <tr key={docente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{docente.nome}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{docente.cognome}</td>
                    <td className="px-6 py-4 text-gray-500">{docente.email}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="info">{docente.n_corsi}</Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={docente.attivo == 1 ? 'success' : 'neutral'}>
                        {docente.attivo == 1 ? 'Attivo' : 'Non attivo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setEditingDocente(docente); setIsModalOpen(true) }}
                        icon={<Pencil size={16} />}
                        title="Modifica"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(docente.id)}
                        icon={<Trash2 size={16} />}
                        title="Elimina"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALE CREAZIONE / MODIFICA */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDocente ? 'Modifica Docente' : 'Nuovo Docente'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input 
                name="nome" 
                defaultValue={editingDocente?.nome} 
                required 
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm px-3 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cognome *</label>
              <input 
                name="cognome" 
                defaultValue={editingDocente?.cognome} 
                required 
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm px-3 py-2" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input 
              type="email" 
              name="email" 
              defaultValue={editingDocente?.email} 
              required 
              className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm px-3 py-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titolo Professionale</label>
            <input 
              name="titolo_professionale" 
              defaultValue={editingDocente?.titolo_professionale} 
              className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm px-3 py-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specializzazione</label>
            <input 
              name="specializzazione" 
              defaultValue={editingDocente?.specializzazione} 
              className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm px-3 py-2" 
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="attivo" 
              name="attivo" 
              defaultChecked={editingDocente ? editingDocente.attivo == 1 : true} 
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="attivo" className="text-sm text-gray-700 select-none cursor-pointer">
              Docente Attivo
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
              Annulla
            </Button>
            <Button type="submit">
              Salva
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}