'use client'

import Sidebar from '@/components/layout/sidebar'
import Navbar from '@/components/layout/navbar'
import { useDashboardStore } from '@/store/dashboard-store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sidebarOpen } = useDashboardStore()

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar mobile: overlay quando aperta */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" />
      )}
      
      <div className="flex">
        {/* Sidebar - nascosta su mobile se chiusa */}
        <div className={`
          fixed lg:relative z-50 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar />
        </div>
        
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-4 md:p-6 overflow-x-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}