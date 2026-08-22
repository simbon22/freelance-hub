'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDashboardStore } from '@/store/dashboard-store'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Receipt,
  Sparkles,
  X,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/clients', label: 'Clienti', icon: Users },
  { href: '/dashboard/projects', label: 'Progetti', icon: FolderKanban },
  { href: '/dashboard/invoices', label: 'Fatture', icon: Receipt },
  { href: '/dashboard/estimate', label: 'Stima AI', icon: Sparkles },
]

export default function Sidebar() {
  const { toggleSidebar } = useDashboardStore()
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-sidebar text-sidebar-foreground min-h-screen flex flex-col border-r border-sidebar-border">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-[11px]">FH</span>
          </div>
          <span className="font-semibold text-sm">Freelance Hub</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => toggleSidebar()}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] transition-colors ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent/60'
              }`}
            >
              <Icon size={16} className="shrink-0 opacity-90" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border">
        <ThemeToggle />
      </div>
    </aside>
  )
}
