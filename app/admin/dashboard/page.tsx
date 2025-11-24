'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, BookOpen, GraduationCap, Tags, TrendingUp, Award } from 'lucide-react'
// Componenti UI
import { StatCard } from '@/app/components/ui/StatCard'
import { Card } from '@/app/components/Card'
// Importa il nuovo Skeleton
import { AdminDashboardSkeleton } from '@/app/components/skeletons/AdminDashboardSkeleton'

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const t = new Date().getTime()
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api-formazione/dashboard/dashboard.php?t=${t}`,
            {
                cache: 'no-store',
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            }
        )
        
        if (res.ok) {
            const json = await res.json()
            setData(json)
        } else {
            setData(mockData)
        }
      } catch (error) {
        console.error("Errore fetch dashboard", error)
        setData(mockData)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  // --- USO DELLO SKELETON ---
  if (loading) return <AdminDashboardSkeleton />

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Benvenuto nel pannello di amministrazione.</p>
      </div>

      {/* 1. STATISTICHE (KPI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Dipendenti Totali"
          value={data?.kpi?.dipendenti || 0}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard 
          label="Corsi Attivi"
          value={data?.kpi?.corsi_attivi || 0}
          icon={<BookOpen className="w-6 h-6" />}
          color="purple"
        />
        <StatCard 
          label="Iscrizioni Totali"
          value={data?.kpi?.iscrizioni_totali || 0}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
        />
        <StatCard 
          label="Tasso Completamento"
          value={`${data?.kpi?.tasso_completamento || 0}%`}
          icon={<Award className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* 2. LINK RAPIDI */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Accesso Rapido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardLink 
              title="Gestione Docenti" 
              description="Anagrafica formatori"
              icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
              href="/admin/docenti"
              bgIcon="bg-blue-50"
            />

            <DashboardLink 
              title="Categorie Corsi" 
              description="Tipologie e tag"
              icon={<Tags className="w-6 h-6 text-purple-600" />}
              href="/admin/categorie"
              bgIcon="bg-purple-50"
            />

            <DashboardLink 
              title="Catalogo Corsi" 
              description="Crea o modifica corsi"
              icon={<BookOpen className="w-6 h-6 text-green-600" />}
              href="/admin/corsi"
              bgIcon="bg-green-50"
            />

            <DashboardLink 
              title="Utenti" 
              description="Gestione dipendenti"
              icon={<Users className="w-6 h-6 text-orange-600" />}
              href="/admin/dipendenti"
              bgIcon="bg-orange-50"
            />
        </div>
      </div>
    </div>
  )
}

// ... DashboardLink e mockData rimangono invariati ...
function DashboardLink({ title, description, icon, href, bgIcon }: any) {
  return (
    <Link href={href} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-md border border-gray-200 hover:border-blue-200 group-hover:-translate-y-1">
        <div className={`inline-flex p-3 rounded-lg ${bgIcon} mb-4 transition-transform duration-200`}>
          {icon}
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </Card>
    </Link>
  )
}

const mockData = {
    kpi: {
        dipendenti: 0,
        corsi_attivi: 0,
        iscrizioni_totali: 0,
        tasso_completamento: 0
    }
}