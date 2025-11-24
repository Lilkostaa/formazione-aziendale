'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, ImageIcon, Video, Users, FileText } from 'lucide-react'
// Componenti UI
import { Button } from '@/app/components/Button'
import { Input } from '@/app/components/ui/Input'
import { Select } from '@/app/components/ui/Select'
import { Textarea } from '@/app/components/ui/TextArea'
import { Checkbox } from '@/app/components/ui/Checkbox'
import { Badge } from '@/app/components/Badge'

// --- INTERFACCE ---
interface Corso {
  id: number
  titolo: string
  descrizione: string
  docente_id: number
  categoria_id: number | null
  giorni_completamento: number
  immagine_path: string
  video_url: string
  attivo: number
  docente_nome?: string
  docente_cognome?: string
  categoria_nome?: string
}

interface Docente {
  id: number
  nome: string
  cognome: string
}

interface Categoria {
  id: number
  nome: string
}

interface Iscrizione {
  id: number
  corso_id: number
  dipendente_nome: string
  dipendente_cognome: string
  data_iscrizione: string
  data_completamento: string | null
  data_scadenza: string
  stato: 'In corso' | 'Completato' | 'Scaduto'
}

export default function CorsiPage() {
  // --- STATI DATI ---
  const [corsi, setCorsi] = useState<Corso[]>([])
  const [docenti, setDocenti] = useState<Docente[]>([])
  const [categorie, setCategorie] = useState<Categoria[]>([])
  const [iscrizioni, setIscrizioni] = useState<Iscrizione[]>([])
  
  // --- STATI UI ---
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'dettagli' | 'iscritti'>('dettagli')
  
  const [editingCorso, setEditingCorso] = useState<Corso | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // --- FETCH DATI ---
  const fetchData = async () => {
    try {
      const [resCorsi, resDocenti, resCategorie, resIscrizioni] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/corsi/read.php`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/docenti/read.php`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/categorie/read.php`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/iscrizioni/read.php`)
      ])

      setCorsi(await resCorsi.json())
      setDocenti(await resDocenti.json())
      setCategorie(await resCategorie.json())
      setIscrizioni(await resIscrizioni.json())
    } catch (error) {
      console.error('Errore caricamento dati:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- AZIONI ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      let imagePath = editingCorso?.immagine_path || ''

      if (selectedFile) {
        const uploadData = new FormData()
        uploadData.append('file', selectedFile)
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/corsi/upload.php`, {
          method: 'POST',
          body: uploadData
        })
        const uploadJson = await uploadRes.json()
        if (!uploadRes.ok) throw new Error(uploadJson.error || 'Errore upload')
        imagePath = uploadJson.path
      }

      const payload = {
        id: editingCorso?.id,
        titolo: formData.get('titolo'),
        descrizione: formData.get('descrizione'),
        docente_id: formData.get('docente_id'),
        categoria_id: formData.get('categoria_id') || null,
        giorni_completamento: formData.get('giorni_completamento'),
        video_url: formData.get('video_url'),
        attivo: formData.get('attivo') ? 1 : 0,
        immagine_path: imagePath 
      }

      const endpoint = editingCorso ? 'update.php' : 'create.php'
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/corsi/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Errore salvataggio corso')

      alert('Corso salvato con successo!')
      closeModal()
      fetchData()

    } catch (error: any) {
      alert('Errore: ' + error.message)
    }
  }

  const handleDelete = async (id: number) => {
    const hasIscritti = iscrizioni.some(i => i.corso_id === id);
    if (hasIscritti) {
        alert("Impossibile eliminare: ci sono dipendenti iscritti a questo corso.");
        return;
    }

    if (!confirm('Sei sicuro? Questa azione è irreversibile.')) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/corsi/delete.php`, {
        method: 'POST',
        body: JSON.stringify({ id })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      fetchData()
    } catch (err: any) {
      alert(err.message)
    }
  }

  // --- HELPERS UI ---
  // Modificato per accettare il tab iniziale
  const openModal = (corso: Corso | null = null, tab: 'dettagli' | 'iscritti' = 'dettagli') => {
    setEditingCorso(corso)
    setSelectedFile(null)
    setPreviewUrl(corso ? `${process.env.NEXT_PUBLIC_API_URL}/api-formazione/${corso.immagine_path}` : null)
    setActiveTab(tab) // Apre direttamente sul tab richiesto
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCorso(null)
    setPreviewUrl(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('it-IT')
  }

  const filteredCorsi = corsi.filter(c => 
    c.titolo.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const docentiOptions = docenti.map(d => ({ label: `${d.cognome} ${d.nome}`, value: d.id }))
  const categorieOptions = categorie.map(c => ({ label: c.nome, value: c.id }))

  const currentIscrizioni = iscrizioni.filter(i => i.corso_id === editingCorso?.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Corsi</h1>
          <p className="text-gray-500">Catalogo formativo aziendale</p>
        </div>
        <Button
          onClick={() => openModal(null, 'dettagli')}
          icon={<Plus size={20} />}
        >
          Nuovo Corso
        </Button>
      </div>

      {/* Tabella */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Input 
              placeholder="Cerca per titolo..." 
              className="pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white text-gray-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-24">Copertina</th>
                <th className="px-6 py-4">Titolo</th>
                <th className="px-6 py-4">Docente</th>
                <th className="px-6 py-4 text-center">Giorni</th>
                <th className="px-6 py-4 text-center">Stato</th>
                <th className="px-6 py-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center">Caricamento...</td></tr>
              ) : filteredCorsi.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Nessun corso trovato.</td></tr>
              ) : (
                filteredCorsi.map((corso) => (
                  <tr key={corso.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-10 relative rounded bg-gray-100 overflow-hidden border border-gray-200">
                        {corso.immagine_path ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img 
                            src={`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/${corso.immagine_path}`} 
                            alt={corso.titolo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon size={16}/></div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{corso.titolo}</div>
                      <div className="text-xs text-gray-500">{corso.categoria_nome || 'Nessuna categoria'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {corso.docente_nome} {corso.docente_cognome}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="neutral">{corso.giorni_completamento}gg</Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={corso.attivo == 1 ? 'success' : 'neutral'}>
                        {corso.attivo == 1 ? 'Attivo' : 'Disattivo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <div className="flex justify-end gap-2">
                        
                        {/* Tasto Iscritti */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openModal(corso, 'iscritti')}
                          title="Vedi Iscritti"
                        >
                          <Users size={18} className="text-gray-500" />
                        </Button>

                        {/* Tasto Modifica */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openModal(corso, 'dettagli')}
                          title="Modifica"
                        >
                          <Pencil size={18} className="text-gray-500" />
                        </Button>
                        
                        {/* Tasto Elimina */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(corso.id)}
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

      {/* MODALE COMPLESSO (TAB) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-slide-in my-8 flex flex-col max-h-[90vh]">
            
            {/* Header Modale */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCorso ? `Gestione Corso: ${editingCorso.titolo}` : 'Nuovo Corso'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
            </div>

            {/* Tab Navigation */}
            {editingCorso && (
              <div className="flex border-b border-gray-200 bg-white px-6">
                <button
                  onClick={() => setActiveTab('dettagli')}
                  className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'dettagli' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FileText size={16} /> Dettagli
                </button>
                <button
                  onClick={() => setActiveTab('iscritti')}
                  className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'iscritti' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Users size={16} /> Iscritti
                  <Badge variant="neutral">{currentIscrizioni.length}</Badge>
                </button>
              </div>
            )}
            
            {/* Contenuto Scrollabile */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* TAB 1: FORM DETTAGLI */}
              {activeTab === 'dettagli' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Input label="Titolo Corso *" name="titolo" defaultValue={editingCorso?.titolo} required />
                      <Select label="Docente *" name="docente_id" defaultValue={editingCorso?.docente_id} required options={docentiOptions} placeholder="Seleziona Docente" />
                      <Select label="Categoria" name="categoria_id" defaultValue={editingCorso?.categoria_id || ''} options={categorieOptions} placeholder="Nessuna Categoria" />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Immagine di Copertina *</label>
                        <label className="flex flex-col items-center justify-center w-full h-[120px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative overflow-hidden">
                          {previewUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                              <ImageIcon className="w-8 h-8 mb-2" />
                              <p className="text-xs">Clicca per caricare</p>
                            </div>
                          )}
                          <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                      </div>
                      <Input label="Link Video (URL) *" name="video_url" defaultValue={editingCorso?.video_url} required placeholder="https://youtube.com/..." />
                    </div>
                  </div>

                  <Textarea label="Descrizione *" name="descrizione" rows={4} defaultValue={editingCorso?.descrizione} required />

                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
                    <div className="w-full sm:w-1/3">
                      <Input label="Giorni Validità *" type="number" name="giorni_completamento" defaultValue={editingCorso?.giorni_completamento || 30} required min="1" />
                    </div>
                    <div className="pb-3">
                      <Checkbox id="attivo_corso" name="attivo" label="Corso Attivo" defaultChecked={editingCorso ? editingCorso.attivo == 1 : true} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={closeModal}>Annulla</Button>
                    <Button type="submit">{editingCorso ? 'Salva Modifiche' : 'Crea Corso'}</Button>
                  </div>
                </form>
              )}

              {/* TAB 2: LISTA ISCRITTI (Read Only) */}
              {activeTab === 'iscritti' && (
                <div className="space-y-4">
                  {currentIscrizioni.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <Users className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-gray-500 font-medium">Nessun dipendente iscritto a questo corso.</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3">Dipendente</th>
                            <th className="px-4 py-3 text-center">Iscrizione</th>
                            <th className="px-4 py-3 text-center">Stato</th>
                            <th className="px-4 py-3 text-center">Completato</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {currentIscrizioni.map((isc) => (
                            <tr key={isc.id}>
                              <td className="px-4 py-3 font-medium text-gray-900">
                                {isc.dipendente_cognome} {isc.dipendente_nome}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {formatDate(isc.data_iscrizione)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Badge variant={
                                  isc.stato === 'Completato' ? 'success' : 
                                  isc.stato === 'Scaduto' ? 'danger' : 'blue'
                                }>
                                  {isc.stato}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-center text-gray-500">
                                {formatDate(isc.data_completamento)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <Button type="button" variant="secondary" onClick={closeModal}>Chiudi</Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}