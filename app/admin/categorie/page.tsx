'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, Filter } from 'lucide-react'

interface Categoria {
  id: number
  nome: string
  attivo: number // 1 o 0
  n_corsi: number
}

export default function CategoriePage() {
  const [categorie, setCategorie] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCat, setEditingCat] = useState<Categoria | null>(null)
  
  // Filtri
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAttivo, setFilterAttivo] = useState(false)
  const [filterSenzaCorsi, setFilterSenzaCorsi] = useState(false)

  // Fetch
  const fetchCategorie = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/categorie/read.php`)
      const data = await res.json()
      setCategorie(data)
    } catch (error) {
      console.error('Errore caricamento:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategorie()
  }, [])

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm('Eliminare questa categoria?')) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/categorie/delete.php`, {
        method: 'POST',
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      alert('Categoria eliminata!')
      fetchCategorie()
    } catch (error: any) {
      alert(error.message)
    }
  }

  // Logica Filtri Combinati
  const filteredCategorie = categorie.filter(cat => {
    const matchesSearch = cat.nome.toLowerCase().includes(searchTerm.toLowerCase())
    // Se il filtro attivo è ON, mostra solo attivi. Altrimenti mostra tutti.
    const matchesAttivo = filterAttivo ? cat.attivo == 1 : true
    // Se il filtro senza corsi è ON, mostra solo n_corsi == 0. Altrimenti mostra tutti.
    const matchesSenzaCorsi = filterSenzaCorsi ? cat.n_corsi == 0 : true

    return matchesSearch && matchesAttivo && matchesSenzaCorsi
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorie</h1>
          <p className="text-gray-500">Gestione tipologie corsi</p>
        </div>
        <button
          onClick={() => { setEditingCat(null); setIsModalOpen(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} /> Nuova Categoria
        </button>
      </div>

      {/* Card Principale */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Toolbar Filtri */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Ricerca */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Cerca categoria..." 
              className="pl-10 w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Toggle Filters */}
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <span className="font-medium">Filtri:</span>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={filterAttivo}
                onChange={(e) => setFilterAttivo(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Solo Attivi
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={filterSenzaCorsi}
                onChange={(e) => setFilterSenzaCorsi(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Senza Corsi
            </label>
          </div>
        </div>

        {/* Tabella */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white text-gray-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Nome Categoria</th>
                <th className="px-6 py-4 text-center">N. Corsi</th>
                <th className="px-6 py-4 text-center">Stato</th>
                <th className="px-6 py-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center">Caricamento...</td></tr>
              ) : filteredCategorie.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Nessuna categoria trovata.</td></tr>
              ) : (
                filteredCategorie.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{cat.nome}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-full text-xs font-medium ${cat.n_corsi > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                        {cat.n_corsi}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {cat.attivo == 1 ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full border border-green-200">
                          Attivo
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full border border-gray-200">
                          Disattivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => { setEditingCat(cat); setIsModalOpen(true) }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
                        title="Modifica"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className={`p-1 transition-colors rounded hover:bg-red-50 ${cat.n_corsi > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-600'}`}
                        title={cat.n_corsi > 0 ? "Impossibile eliminare (corsi associati)" : "Elimina"}
                        disabled={cat.n_corsi > 0}
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

      {/* Modale Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCat ? 'Modifica Categoria' : 'Nuova Categoria'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const payload = {
                id: editingCat?.id,
                nome: formData.get('nome'),
                attivo: formData.get('attivo') ? 1 : 0
              }

              const endpoint = editingCat ? 'update.php' : 'create.php'
              
              try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/categorie/${endpoint}`, {
                  method: 'POST',
                  body: JSON.stringify(payload),
                })
                if (!res.ok) throw new Error('Errore salvataggio')
                
                fetchCategorie()
                setIsModalOpen(false)
              } catch (err) {
                alert('Errore durante il salvataggio')
              }
            }}>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Categoria *</label>
                  <input 
                    name="nome" 
                    defaultValue={editingCat?.nome} 
                    required 
                    autoFocus
                    className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                    placeholder="Es. Sicurezza, Marketing..."
                  />
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <input 
                    type="checkbox" 
                    id="attivo" 
                    name="attivo" 
                    defaultChecked={editingCat ? editingCat.attivo == 1 : true} 
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="attivo" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                    Categoria Attiva
                  </label>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Annulla</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  {editingCat ? 'Aggiorna' : 'Crea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}