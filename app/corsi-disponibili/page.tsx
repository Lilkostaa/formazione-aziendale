'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  LogOut, 
  BookOpen,
  Layout
} from 'lucide-react'

// Tipi
interface CorsoFrontend {
  id: number
  titolo: string
  docente_nome: string
  docente_cognome: string
  giorni_completamento: number
  immagine_path: string
  stato_iscrizione: 'disponibile' | 'in_corso' | 'completato' | 'scaduto'
  data_scadenza?: string
}

interface DashboardData {
  stats: {
    completati: number
    in_corso: number
    scaduti: number
    disponibili: number
  }
  corsi: CorsoFrontend[]
}

export default function EmployeeDashboard() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboard(session.user.id)
    }
  }, [session])

  const fetchDashboard = async (userId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/frontend/dashboard.php?id=${userId}`)
      const json = await res.json()
      setData(json)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Caricamento...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Navbar Semplificata */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
          <span className="text-blue-600">d</span>dieffe.tech
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Ciao, {session?.user?.name}</span>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <LogOut size={16} /> Esci
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Intestazione */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">La tua Formazione</h1>
          <p className="text-gray-500 mt-1">Monitora i tuoi progressi e scopri nuovi corsi.</p>
        </div>

        {/* Metriche (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            label="Completati" 
            value={data?.stats.completati || 0} 
            icon={<CheckCircle className="text-green-600" />} 
            bg="bg-green-50" 
            text="text-green-700"
          />
          <StatCard 
            label="In Corso" 
            value={data?.stats.in_corso || 0} 
            icon={<PlayCircle className="text-blue-600" />} 
            bg="bg-blue-50" 
            text="text-blue-700"
          />
          <StatCard 
            label="Scaduti" 
            value={data?.stats.scaduti || 0} 
            icon={<AlertCircle className="text-red-600" />} 
            bg="bg-red-50" 
            text="text-red-700"
          />
          <StatCard 
            label="Disponibili" 
            value={data?.stats.disponibili || 0} 
            icon={<BookOpen className="text-purple-600" />} 
            bg="bg-purple-50" 
            text="text-purple-700"
          />
        </div>

        {/* Lista Corsi */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Catalogo Corsi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.corsi.map(corso => (
              <div key={corso.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                {/* Immagine Copertina */}
                <div className="h-40 bg-gray-100 relative">
                  {corso.immagine_path ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={`http://localhost:8000/api-formazione/${corso.immagine_path}`} 
                      alt={corso.titolo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Layout size={40} />
                    </div>
                  )}
                  
                  {/* Badge Stato */}
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={corso.stato_iscrizione} />
                  </div>
                </div>

                {/* Contenuto */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1" title={corso.titolo}>{corso.titolo}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {corso.docente_nome} {corso.docente_cognome}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={14} />
                      <span>{corso.giorni_completamento} giorni</span>
                    </div>
                    
                    {/* Azione (segnaposto per ora) */}
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      corso.stato_iscrizione === 'disponibile' 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      {corso.stato_iscrizione === 'disponibile' ? 'Iscriviti' : 'Vai al corso'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}

// Componenti UI Helper
function StatCard({ label, value, icon, bg, text }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-full ${bg}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className={`text-sm font-medium ${text}`}>{label}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    disponibile: 'bg-gray-100 text-gray-700',
    in_corso: 'bg-blue-100 text-blue-700',
    completato: 'bg-green-100 text-green-700',
    scaduto: 'bg-red-100 text-red-700'
  }
  
  const labels = {
    disponibile: 'Nuovo',
    in_corso: 'In Corso',
    completato: 'Completato',
    scaduto: 'Scaduto'
  }

  // @ts-ignore
  return <span className={`px-2 py-1 rounded text-xs font-semibold shadow-sm ${styles[status]}`}>
    {/* @ts-ignore */}
    {labels[status]}
  </span>
}