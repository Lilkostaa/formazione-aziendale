import Link from 'next/link'
import { Users, BookOpen, GraduationCap, Tags } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Benvenuto nel pannello di amministrazione.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Docenti */}
        <DashboardCard 
          title="Docenti" 
          description="Gestisci i formatori"
          icon={<GraduationCap className="w-8 h-8 text-blue-600" />}
          href="/admin/docenti"
          color="bg-blue-50"
        />

        {/* Card Categorie */}
        <DashboardCard 
          title="Categorie" 
          description="Tipologie corsi"
          icon={<Tags className="w-8 h-8 text-purple-600" />}
          href="/admin/categorie"
          color="bg-purple-50"
        />

        {/* Card Corsi (Prossimamente) */}
        <DashboardCard 
          title="Corsi" 
          description="Catalogo formativo"
          icon={<BookOpen className="w-8 h-8 text-green-600" />}
          href="/admin/corsi"
          color="bg-green-50"
        />

        {/* Card Dipendenti (Prossimamente) */}
        <DashboardCard 
          title="Dipendenti" 
          description="Utenti piattaforma"
          icon={<Users className="w-8 h-8 text-orange-600" />}
          href="/admin/dipendenti"
          color="bg-orange-50"
        />
      </div>
    </div>
  )
}

function DashboardCard({ title, description, icon, href, color }: any) {
  return (
    <Link 
      href={href}
      className="block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
    >
      <div className={`inline-flex p-3 rounded-lg ${color} mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  )
}