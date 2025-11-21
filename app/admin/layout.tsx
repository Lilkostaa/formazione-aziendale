import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  LogOut,
  ClipboardList
} from 'lucide-react'
import { auth, signOut } from '@/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Laterale */}
      <aside className="w-64 bg-[#0f172a] text-white shrink-0 hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="text-2xl font-bold flex items-center gap-2">
            <span className="text-blue-500">d</span>dieffe.tech
          </div>
          <p className="text-xs text-gray-500 mt-1">Pannello Admin</p>
        </div>

        {/* Menu di Navigazione */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem href="/admin/corsi" icon={<BookOpen size={20} />} label="Corsi" />
          <NavItem href="/admin/dipendenti" icon={<Users size={20} />} label="Dipendenti" />
          <NavItem href="/admin/iscrizioni" icon={<ClipboardList size={20} />} label="Iscrizioni" />
          <NavItem href="/admin/docenti" icon={<GraduationCap size={20} />} label="Docenti" />
          <NavItem href="/admin/report" icon={<FileText size={20} />} label="Report" />
        </nav>

        {/* Footer Sidebar (Utente + Logout) */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <form
            action={async () => {
              'use server'
              await signOut()
            }}
          >
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white w-full transition-colors">
              <LogOut size={16} /> Esci
            </button>
          </form>
        </div>
      </aside>

      {/* Contenuto Principale */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}

// Componente di appoggio per i link (puoi metterlo nello stesso file o separato)
function NavItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}