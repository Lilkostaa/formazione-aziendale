'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PlayCircle, CheckCircle, Clock, AlertCircle, LogOut, BookOpen, Layout } from 'lucide-react'
// Componenti UI
import { Button } from '@/app/components/Button'
import { Card } from '@/app/components/Card'
import { Badge } from '@/app/components/Badge'
import { StatCard } from '@/app/components/ui/StatCard'
// Importa lo Skeleton
import { DashboardSkeleton } from '@/app/components/skeletons/DashboardSkeleton'

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
    const router = useRouter()
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (session?.user?.id) {
            fetchDashboard(session.user.id)
        }
    }, [session])

    const fetchDashboard = async (userId: string) => {
        try {
            // Timestamp per rompere la cache del browser
            const t = new Date().getTime()
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api-formazione/frontend/dashboard.php?id=${userId}&t=${t}`, 
                {
                    cache: 'no-store',
                    headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
                }
            )
            const json = await res.json()
            setData(json)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubscribe = async (corsoId: number) => {
        if (!session?.user?.id) return
        if (!confirm('Vuoi iscriverti a questo corso?')) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/frontend/iscriviti.php`, {
                method: 'POST',
                body: JSON.stringify({
                    dipendente_id: session.user.id,
                    corso_id: corsoId
                })
            })

            const json = await res.json()
            if (!res.ok) throw new Error(json.error)

            alert('Iscrizione confermata! Buon studio.')
            fetchDashboard(session.user.id)

        } catch (error: any) {
            alert(error.message)
        }
    }

    // Utilizzo dello Skeleton Loader al posto del testo semplice
    if (loading) return <DashboardSkeleton />

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
                    <span className="text-blue-600">d</span>dieffe.tech
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 hidden sm:inline">Ciao, {session?.user?.name}</span>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        icon={<LogOut size={16} />}
                    >
                        Esci
                    </Button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 space-y-8">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">La tua Formazione</h1>
                    <p className="text-gray-500 mt-1">Monitora i tuoi progressi e scopri nuovi corsi.</p>
                </div>

                {/* Metriche (StatCard) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="Completati"
                        value={data?.stats.completati || 0}
                        icon={<CheckCircle className="w-6 h-6" />}
                        color="green"
                    />
                    <StatCard
                        label="In Corso"
                        value={data?.stats.in_corso || 0}
                        icon={<PlayCircle className="w-6 h-6" />}
                        color="blue"
                    />
                    <StatCard
                        label="Scaduti"
                        value={data?.stats.scaduti || 0}
                        icon={<AlertCircle className="w-6 h-6" />}
                        color="red"
                    />
                    <StatCard
                        label="Disponibili"
                        value={data?.stats.disponibili || 0}
                        icon={<BookOpen className="w-6 h-6" />}
                        color="purple"
                    />
                </div>

                {/* Lista Corsi */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Catalogo Corsi</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data?.corsi.map(corso => (
                            <Card key={corso.id} noPadding className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                                {/* Immagine */}
                                <div className="h-48 bg-gray-100 relative overflow-hidden group">
                                    {corso.immagine_path ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/${corso.immagine_path}`}
                                            alt={corso.titolo}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Layout size={48} />
                                        </div>
                                    )}

                                    <div className="absolute top-3 right-3">
                                        <StatusBadge status={corso.stato_iscrizione} />
                                    </div>
                                </div>

                                {/* Contenuto */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1" title={corso.titolo}>
                                        {corso.titolo}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {corso.docente_nome} {corso.docente_cognome}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                            <Clock size={14} />
                                            <span>{corso.giorni_completamento} giorni</span>
                                        </div>

                                        <Button
                                            size="sm"
                                            variant={corso.stato_iscrizione === 'disponibile' ? 'primary' : 'secondary'}
                                            onClick={() => {
                                                if (corso.stato_iscrizione === 'disponibile') {
                                                    handleSubscribe(corso.id)
                                                } else {
                                                    router.push(`/corso/${corso.id}`)
                                                }
                                            }}
                                        >
                                            {corso.stato_iscrizione === 'disponibile' ? 'Iscriviti' : 'Vai al corso'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const variantMap: Record<string, 'neutral' | 'blue' | 'success' | 'danger'> = {
        disponibile: 'neutral',
        in_corso: 'blue',
        completato: 'success',
        scaduto: 'danger'
    }

    const labelMap: Record<string, string> = {
        disponibile: 'Nuovo',
        in_corso: 'In Corso',
        completato: 'Completato',
        scaduto: 'Scaduto'
    }

    return (
        <Badge variant={variantMap[status] || 'neutral'}>
            {labelMap[status]}
        </Badge>
    )
}