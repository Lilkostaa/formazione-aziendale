'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, BookOpen, GraduationCap, FileText, LogOut, User } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Users, label: 'Dipendenti', href: '/admin/dipendenti' },
    { icon: BookOpen, label: 'Corsi', href: '/admin/corsi' },
    { icon: GraduationCap, label: 'Docenti', href: '/admin/docenti' },
    { icon: FileText, label: 'Categorie', href: '/admin/categorie' },
    { icon: FileText, label: 'Report', href: '/admin/report' },
  ]

  return (
    // Layout a "guscio" fisso (h-screen)
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 font-sans">
      
      {/* SIDEBAR BLU */}
      <aside className="w-64 bg-[#062485] text-white flex flex-col flex-shrink-0 z-20 shadow-xl">
        
        {/* Logo (Bianco su Blu) */}
        <div className="p-6 border-b border-blue-800 flex items-center gap-2">
           <div className="bg-white text-[#1e40af] w-8 h-8 rounded flex items-center justify-center font-bold text-xl">d</div>
           <span className="font-bold text-xl tracking-tight text-white">dieffe.tech</span>
        </div>

        {/* Menu Navigazione */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white text-[#1e40af] font-medium shadow-sm' 
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-[#1e40af]' : 'text-blue-300 group-hover:text-white'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Sidebar (Utente + Logout) */}
        <div className="p-4 border-t border-blue-800 bg-[#173691]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center text-white font-bold border border-blue-500">
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
              <p className="text-xs text-blue-200 truncate">{session?.user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-red-600/80 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Esci
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      {/* w-full assicura che occupi tutto lo spazio rimanente */}
      <main className="flex-1 overflow-y-auto bg-gray-50 relative w-full">
        <div className="p-6 md:p-8 pb-20 min-w-0">
          {children}
        </div>
      </main>

    </div>
  )
}