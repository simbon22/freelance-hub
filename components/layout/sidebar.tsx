'use client'

import Link from 'next/link'
import { useDashboardStore } from '@/store/dashboard-store'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useDashboardStore()

  return (
    <aside className="w-64 bg-card/80 backdrop-blur-sm border-r h-screen flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">FH</span>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Freelance Hub
            </h2>
          </div>
          {/* Pulsante chiudi su mobile */}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/dashboard" onClick={() => toggleSidebar()} className="flex items-center gap-3 hover:bg-accent p-2 rounded-lg transition-all">
            <span>📊</span> Dashboard
          </Link>
          <Link href="/dashboard/clients" onClick={() => toggleSidebar()} className="flex items-center gap-3 hover:bg-accent p-2 rounded-lg transition-all">
            <span>👥</span> Clienti
          </Link>
          <Link href="/dashboard/projects" onClick={() => toggleSidebar()} className="flex items-center gap-3 hover:bg-accent p-2 rounded-lg transition-all">
            <span>📁</span> Progetti
          </Link>
          <Link href="/dashboard/invoices" onClick={() => toggleSidebar()} className="flex items-center gap-3 hover:bg-accent p-2 rounded-lg transition-all">
            <span>💰</span> Fatture
          </Link>
          <Link href="/dashboard/estimate" onClick={() => toggleSidebar()} className="flex items-center gap-3 hover:bg-accent p-2 rounded-lg transition-all">
            <span>🤖</span> Stima AI
          </Link>
        </nav>
        
        <div className="p-4 border-t">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}