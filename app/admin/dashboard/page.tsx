import Link from 'next/link'
import { Users, BookOpen, GraduationCap, Tags } from 'lucide-react'
import { Card } from '@/app/components/Card'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Benvenuto nel pannello di amministrazione.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardLink 
          title="Docenti" 
          description="Gestisci i formatori"
          icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
          href="/admin/docenti"
          bgIcon="bg-blue-50"
        />

        <DashboardLink 
          title="Categorie" 
          description="Tipologie corsi"
          icon={<Tags className="w-6 h-6 text-purple-600" />}
          href="/admin/categorie"
          bgIcon="bg-purple-50"
        />

        <DashboardLink 
          title="Corsi" 
          description="Catalogo formativo"
          icon={<BookOpen className="w-6 h-6 text-green-600" />}
          href="/admin/corsi"
          bgIcon="bg-green-50"
        />

        <DashboardLink 
          title="Dipendenti" 
          description="Utenti piattaforma"
          icon={<Users className="w-6 h-6 text-orange-600" />}
          href="/admin/dipendenti"
          bgIcon="bg-orange-50"
        />
      </div>
    </div>
  )
}

function DashboardLink({ title, description, icon, href, bgIcon }: any) {
  return (
    <Link href={href} className="block group">
      <Card className="h-full transition-all duration-200 group-hover:shadow-md group-hover:border-primary-200">
        <div className={`inline-flex p-3 rounded-lg ${bgIcon} mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </Card>
    </Link>
  )
}