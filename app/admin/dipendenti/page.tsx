'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, KeyRound, Copy, Check } from 'lucide-react'

interface Dipendente {
  id: number
  nome: string
  cognome: string
  email: string
  ruolo: 'admin' | 'dipendente'
  created_at: string
}

export default function DipendentiPage() {
  const [dipendenti, setDipendenti] = useState<Dipendente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Stati per Modale Form
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDipendente, setEditingDipendente] = useState<Dipendente | null>(null)

  // Stati per "Link Magico" (Simulazione Email)
  const [magicLink, setMagicLink] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)

  // --- FETCH DATI ---
  const fetchDipendenti = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/dipendenti/read.php`)
      const data = await res.json()
      setDipendenti(data)
    } catch (error) {
      console.error('Errore caricamento:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDipendenti()
  }, [])

  // --- AZIONI ---
  
  // Creazione / Modifica
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData)
    if (editingDipendente) payload.id = editingDipendente.id.toString()

    const endpoint = editingDipendente ? 'update.php' : 'create.php'

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/dipendenti/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Errore')

      // Se è una creazione, mostra il link di attivazione
      if (data.debug_link) {
        setMagicLink(data.debug_link)
      } else {
        alert('Operazione completata!')
        setIsModalOpen(false)
      }
      
      fetchDipendenti()
    } catch (error: any) {
      alert('Errore: ' + error.message)
    }
  }

  // Eliminazione
  const handleDelete = async (id: number) => {
    if (!confirm('Eliminare definitivamente questo utente?')) return
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/dipendenti/delete.php`, {
        method: 'POST',
        body: JSON.stringify({ id }),
      })
      fetchDipendenti()
    } catch (error) {
      alert('Errore eliminazione')
    }
  }

  // Reset Password Manuale
  const handleResetPassword = async (id: number) => {
    if (!confirm('Generare un nuovo link di reset password per questo utente?')) return
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/dipendenti/reset_password.php`, {
        method: 'POST',
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.debug_link) {
        setMagicLink(data.debug_link)
      }
    } catch (error) {
      alert('Errore generazione link')
    }
  }

  // Copia Link
  const copyToClipboard = () => {
    if (magicLink) {
      navigator.clipboard.writeText(magicLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  // Filtro
  const filtered = dipendenti.filter(d => 
    d.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dipendenti</h1>
          <p className="text-gray-500">Gestione utenti e accessi</p>
        </div>
        <button
          onClick={() => { setEditingDipendente(null); setIsModalOpen(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} /> Nuovo Dipendente
        </button>
      </div>

      {/* Tabella */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Cerca per cognome o email..." 
              className="pl-10 w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Cognome</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Ruolo</th>
                <th className="px-6 py-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center">Caricamento...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center">Nessun dipendente trovato.</td></tr>
              ) : (
                filtered.map((dip) => (
                  <tr key={dip.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{dip.nome}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{dip.cognome}</td>
                    <td className="px-6 py-4">{dip.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${dip.ruolo === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {dip.ruolo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleResetPassword(dip.id)}
                        className="text-gray-400 hover:text-orange-500" 
                        title="Invia Reset Password"
                      >
                        <KeyRound size={18} />
                      </button>
                      <button 
                        onClick={() => { setEditingDipendente(dip); setIsModalOpen(true) }}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(dip.id)}
                        className="text-gray-400 hover:text-red-600"
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

      {/* MODALE LINK ATTIVAZIONE (Simulazione Email) */}
      {magicLink && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-6 text-center animate-fade-in">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Email inviata (Simulazione)</h3>
            <p className="text-sm text-gray-500 mb-4">
              In un ambiente reale, l'utente riceverebbe una mail. Qui sotto trovi il link generato per testare subito il flusso.
            </p>
            
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
              <code className="text-xs text-blue-600 break-all flex-1 text-left">
                {magicLink}
              </code>
              <button onClick={copyToClipboard} className="text-gray-400 hover:text-gray-700">
                {linkCopied ? <Check size={16} className="text-green-500"/> : <Copy size={16} />}
              </button>
            </div>

            <button 
              onClick={() => { setMagicLink(null); setIsModalOpen(false); }}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}

      {/* MODALE FORM */}
      {isModalOpen && !magicLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-slide-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {editingDipendente ? 'Modifica Dipendente' : 'Nuovo Dipendente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input name="nome" defaultValue={editingDipendente?.nome} required className="w-full border-gray-300 rounded-lg focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
                <input name="cognome" defaultValue={editingDipendente?.cognome} required className="w-full border-gray-300 rounded-lg focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" defaultValue={editingDipendente?.email} required className="w-full border-gray-300 rounded-lg focus:ring-blue-500" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100">Annulla</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  {editingDipendente ? 'Aggiorna' : 'Crea e Invia Invito'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}