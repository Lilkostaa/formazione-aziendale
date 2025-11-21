'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, ArrowLeft, User } from 'lucide-react'
import Link from 'next/link'

interface CorsoDettaglio {
  id: number
  titolo: string
  descrizione: string
  video_url: string
  docente_nome: string
  docente_cognome: string
  data_completamento: string | null
}

export default function CorsoPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [corso, setCorso] = useState<CorsoDettaglio | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Recupera l'ID del corso dall'URL
  const corsoId = params.id

  useEffect(() => {
    if (session?.user?.id && corsoId) {
      fetchCorso()
    }
  }, [session, corsoId])

  const fetchCorso = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/frontend/corso.php?dipendente_id=${session?.user?.id}&corso_id=${corsoId}`)
      
      if (res.status === 403) {
        alert('Devi prima iscriverti a questo corso!')
        router.push('/corsi-disponibili')
        return
      }
      
      const data = await res.json()
      setCorso(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleta = async () => {
    if (!confirm('Hai terminato la visione del corso?')) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/frontend/completa.php`, {
        method: 'POST',
        body: JSON.stringify({
          dipendente_id: session?.user?.id,
          corso_id: corsoId
        })
      })
      
      if (res.ok) {
        alert('Congratulazioni! Corso completato.')
        fetchCorso() // Ricarica per aggiornare lo stato
      }
    } catch (error) {
      alert('Errore durante il salvataggio')
    }
  }

  // Funzione per estrarre ID video da Youtube (per embed)
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return ''
    // Gestisce formati: youtu.be/ID, youtube.com/watch?v=ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}` 
      : url // Ritorna url originale se non è youtube standard (potrebbe non funzionare in iframe)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Caricamento...</div>
  if (!corso) return <div className="min-h-screen flex items-center justify-center">Corso non trovato</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 mb-8">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/corsi-disponibili" className="text-gray-500 hover:text-gray-800">
            <ArrowLeft />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 truncate">{corso.titolo}</h1>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pb-12">
        
        {/* Player Video */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg mb-8">
          <iframe 
            width="100%" 
            height="100%" 
            src={getYoutubeEmbedUrl(corso.video_url)} 
            title={corso.titolo} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonna Sinistra: Dettagli */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Descrizione</h2>
              <div className="prose text-gray-600">
                {corso.descrizione}
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Docente</p>
                <p className="font-medium text-gray-900">{corso.docente_nome} {corso.docente_cognome}</p>
              </div>
            </div>
          </div>

          {/* Colonna Destra: Azione */}
          <div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24 text-center">
              {corso.data_completamento ? (
                <div className="space-y-4">
                  <div className="inline-flex p-4 bg-green-100 rounded-full mb-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-green-700">Corso Completato!</h3>
                  <p className="text-sm text-gray-500">
                    Hai completato questo corso il {new Date(corso.data_completamento).toLocaleDateString('it-IT')}.
                  </p>
                  <Link href="/corsi-disponibili" className="block w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">
                    Torna alla Dashboard
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Guarda il video e segna il corso come completato per aggiornare i tuoi progressi.
                  </p>
                  <button 
                    onClick={handleCompleta}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    Segna come Completato
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}