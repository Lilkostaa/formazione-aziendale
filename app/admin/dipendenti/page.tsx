'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, KeyRound, Copy, Check, Upload, FileSpreadsheet } from 'lucide-react'

// Interfaccia per il tipo di dato Dipendente
interface Dipendente {
  id: number
  nome: string
  cognome: string
  email: string
  ruolo: 'admin' | 'dipendente'
  created_at: string
}

export default function DipendentiPage() {
  // --- STATI ---
  const [dipendenti, setDipendenti] = useState<Dipendente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Stati per il Modale di Creazione/Modifica
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDipendente, setEditingDipendente] = useState<Dipendente | null>(null)

  // Stati per il "Link Magico" (Simulazione Email)
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

  // --- AZIONI CRUD ---
  
  // Creazione o Modifica Dipendente
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData)
    
    if (editingDipendente) {
      payload.id = editingDipendente.id.toString()
    }

    const endpoint = editingDipendente ? 'update.php' : 'create.php'

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/dipendenti/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Errore durante il salvataggio')

      // Se il server restituisce un link di attivazione (creazione), mostralo
      if (data.debug_link) {
        setMagicLink(data.debug_link)
      } else {
        alert('Operazione completata con successo!')
        setIsModalOpen(false)
      }
      
      fetchDipendenti()
    } catch (error: any) {
      alert('Errore: ' + error.message)
    }
  }

  // Eliminazione Dipendente
  const handleDelete = async (id: number) => {
    if (!confirm('Sei sicuro di voler eliminare definitivamente questo utente?')) return
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/dipendenti/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      
      if (!res.ok) throw new Error('Errore durante l\'eliminazione')
      
      fetchDipendenti()
    } catch (error) {
      alert('Errore eliminazione')
    }
  }

  // Reset Password Manuale (Genera nuovo link)
  const handleResetPassword = async (id: number) => {
    if (!confirm('Vuoi generare un nuovo link di reset password per questo utente?')) return
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/dipendenti/reset_password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      
      if (data.debug_link) {
        setMagicLink(data.debug_link)
      } else {
        alert('Errore: Link non generato.')
      }
    } catch (error) {
      alert('Errore generazione link')
    }
  }

  // Importazione File Excel (.xlsx)
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Resetta il valore dell'input per permettere di ricaricare lo stesso file se necessario
    e.target.value = ''

    if (!confirm(`Vuoi importare i dipendenti dal file "${file.name}"?`)) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/dipendenti/import.php`, {
        method: 'POST',
        body: formData,
      })
      
      const json = await res.json()
      
      if (!res.ok) throw new Error(json.error || 'Errore durante l\'importazione')
      
      alert(`Importazione riuscita!\n✅ Inseriti: ${json.imported}\n⚠️ Saltati (già esistenti): ${json.skipped}`)
      fetchDipendenti()
      
    } catch (err: any) {
      alert('Errore: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Funzione Helper per copiare il link
  const copyToClipboard = () => {
    if (magicLink) {
      navigator.clipboard.writeText(magicLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  // Filtro locale per la ricerca
  const filtered = dipendenti.filter(d => 
    d.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* --- HEADER PAGINA --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dipendenti</h1>
          <p className="text-gray-500">Gestione utenti e accessi alla piattaforma</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          {/* Bottone Importa Excel */}
          <label className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white border border-green-700 rounded-lg hover:bg-green-700 transition-colors cursor-pointer shadow-sm font-medium flex-1 sm:flex-none">
            <FileSpreadsheet size={20} />
            <span>Importa Excel</span>
            <input 
              type="file" 
              accept=".xlsx" 
              className="hidden" 
              onChange={handleImport}
            />
          </label>

          {/* Bottone Nuovo Dipendente */}
          <button
            onClick={() => { setEditingDipendente(null); setIsModalOpen(true) }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium flex-1 sm:flex-none"
          >
            <Plus size={20} /> <span>Nuovo</span>
          </button>
        </div>
      </div>

      {/* --- TABELLA --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Barra di Ricerca */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Cerca per nome, cognome o email..." 
              className="pl-10 w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabella Dati */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white text-gray-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Cognome</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Ruolo</th>
                <th className="px-6 py-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center">Caricamento in corso...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Nessun dipendente trovato.</td></tr>
              ) : (
                filtered.map((dip) => (
                  <tr key={dip.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{dip.nome}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{dip.cognome}</td>
                    <td className="px-6 py-4 text-gray-500">{dip.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        dip.ruolo === 'admin' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {dip.ruolo === 'admin' ? 'Amministratore' : 'Dipendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => handleResetPassword(dip.id)}
                        className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors" 
                        title="Invia link reset password"
                      >
                        <KeyRound size={18} />
                      </button>
                      <button 
                        onClick={() => { setEditingDipendente(dip); setIsModalOpen(true) }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Modifica"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(dip.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Elimina"
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

      {/* --- MODALE LINK ATTIVAZIONE (Simulazione Email) --- */}
      {magicLink && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Email inviata (Simulazione)</h3>
            <p className="text-sm text-gray-500 mb-6">
              In un ambiente di produzione, l'utente riceverebbe una mail. <br/>
              Ecco il link di attivazione generato per testare il flusso:
            </p>
            
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 mb-6 relative group">
              <code className="text-xs text-blue-600 break-all flex-1 text-left font-mono">
                {magicLink}
              </code>
              <button 
                onClick={copyToClipboard} 
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                title="Copia Link"
              >
                {linkCopied ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
              </button>
            </div>

            <button 
              onClick={() => { setMagicLink(null); setIsModalOpen(false); }}
              className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Chiudi e Continua
            </button>
          </div>
        </div>
      )}

      {/* --- MODALE FORM (Crea / Modifica) --- */}
      {isModalOpen && !magicLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingDipendente ? 'Modifica Dipendente' : 'Nuovo Dipendente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome <span className="text-red-500">*</span></label>
                <input 
                  name="nome" 
                  defaultValue={editingDipendente?.nome} 
                  required 
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                  placeholder="Mario"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cognome <span className="text-red-500">*</span></label>
                <input 
                  name="cognome" 
                  defaultValue={editingDipendente?.cognome} 
                  required 
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                  placeholder="Rossi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  name="email" 
                  defaultValue={editingDipendente?.email} 
                  required 
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                  placeholder="mario.rossi@azienda.it"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-50 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annulla
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {editingDipendente ? 'Salva Modifiche' : 'Crea e Invia Invito'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}