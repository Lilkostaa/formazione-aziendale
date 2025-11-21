'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, ImageIcon, Video } from 'lucide-react'
import Image from 'next/image'

// Interfacce basate sul DB
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
  // Campi joinati
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

export default function CorsiPage() {
  // Stati Dati
  const [corsi, setCorsi] = useState<Corso[]>([])
  const [docenti, setDocenti] = useState<Docente[]>([])
  const [categorie, setCategorie] = useState<Categoria[]>([])
  
  // Stati UI
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCorso, setEditingCorso] = useState<Corso | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Stato Upload Immagine
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // --- FETCH DATI ---
  const fetchData = async () => {
    try {
      const [resCorsi, resDocenti, resCategorie] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/corsi/read.php`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/docenti/read.php`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/categorie/read.php`)
      ])

      setCorsi(await resCorsi.json())
      setDocenti(await resDocenti.json())
      setCategorie(await resCategorie.json())
    } catch (error) {
      console.error('Errore caricamento dati:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- GESTIONE FORM SUBMIT ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      let imagePath = editingCorso?.immagine_path || ''

      // 1. Se c'è un file selezionato, facciamo prima l'upload
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

      // 2. Prepariamo i dati finali del corso
      const payload = {
        id: editingCorso?.id,
        titolo: formData.get('titolo'),
        descrizione: formData.get('descrizione'),
        docente_id: formData.get('docente_id'),
        categoria_id: formData.get('categoria_id') || null,
        giorni_completamento: formData.get('giorni_completamento'),
        video_url: formData.get('video_url'),
        attivo: formData.get('attivo') ? 1 : 0,
        immagine_path: imagePath // Usiamo il path appena ottenuto (o quello vecchio)
      }

      // 3. Inviamo i dati al DB
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
  const openModal = (corso: Corso | null = null) => {
    setEditingCorso(corso)
    setSelectedFile(null)
    // Se stiamo modificando, mostriamo l'immagine esistente come anteprima
    setPreviewUrl(corso ? `${process.env.NEXT_PUBLIC_API_URL}${corso.immagine_path}` : null)
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

  const filteredCorsi = corsi.filter(c => 
    c.titolo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Corsi</h1>
          <p className="text-gray-500">Catalogo formativo aziendale</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} /> Nuovo Corso
        </button>
      </div>

      {/* Tabella */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Cerca per titolo..." 
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
                <th className="px-6 py-4 w-24">Copertina</th>
                <th className="px-6 py-4">Titolo</th>
                <th className="px-6 py-4">Docente</th>
                <th className="px-6 py-4 text-center">Giorni</th>
                <th className="px-6 py-4 text-center">Stato</th>
                <th className="px-6 py-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
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
                          /* Usiamo un tag img standard perché il path viene da un dominio esterno (localhost:8000) */
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
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">
                        {corso.giorni_completamento}gg
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {corso.attivo == 1 ? (
                        <span className="inline-flex w-2 h-2 bg-green-500 rounded-full" title="Attivo"></span>
                      ) : (
                        <span className="inline-flex w-2 h-2 bg-gray-300 rounded-full" title="Disattivo"></span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openModal(corso)} className="text-gray-400 hover:text-blue-600">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(corso.id)} className="text-gray-400 hover:text-red-600">
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

      {/* MODALE CORSO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-in my-8">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCorso ? 'Modifica Corso' : 'Nuovo Corso'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Griglia 2 colonne */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titolo *</label>
                    <input name="titolo" defaultValue={editingCorso?.titolo} required className="w-full border-gray-300 rounded-lg focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Docente *</label>
                    <select name="docente_id" defaultValue={editingCorso?.docente_id} required className="w-full border-gray-300 rounded-lg focus:ring-blue-500">
                      <option value="">Seleziona Docente</option>
                      {docenti.map(d => (
                        <option key={d.id} value={d.id}>{d.cognome} {d.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select name="categoria_id" defaultValue={editingCorso?.categoria_id || ''} className="w-full border-gray-300 rounded-lg focus:ring-blue-500">
                      <option value="">Nessuna Categoria</option>
                      {categorie.map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Colonna Destra: Upload e Anteprima */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Immagine di Copertina *</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative overflow-hidden">
                        {previewUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500">Clicca per caricare (JPG, PNG)</p>
                          </div>
                        )}
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link Video (URL) *</label>
                    <div className="relative">
                      <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input name="video_url" defaultValue={editingCorso?.video_url} required placeholder="https://..." className="pl-10 w-full border-gray-300 rounded-lg focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Descrizione (Full Width) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                <textarea name="descrizione" rows={3} defaultValue={editingCorso?.descrizione} required className="w-full border-gray-300 rounded-lg focus:ring-blue-500" />
              </div>

              {/* Riga Finale: Giorni e Attivo */}
              <div className="flex gap-6 items-end">
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giorni Validità *</label>
                  <input type="number" name="giorni_completamento" defaultValue={editingCorso?.giorni_completamento || 30} required min="1" className="w-full border-gray-300 rounded-lg focus:ring-blue-500" />
                </div>
                
                <div className="flex items-center gap-3 pb-3">
                  <input type="checkbox" name="attivo" id="attivo_corso" defaultChecked={editingCorso ? editingCorso.attivo == 1 : true} className="h-5 w-5 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor="attivo_corso" className="text-sm font-medium text-gray-700">Corso Attivo</label>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Annulla</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  {editingCorso ? 'Salva Modifiche' : 'Crea Corso'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}