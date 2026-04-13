'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function DashboardPage() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser()
      return data.user
    },
  })

  const { data: projects = [] } = useQuery({
    queryKey: ['dashboard-projects', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, clients(name)')
        .eq('user_id', user!.id)
      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!user?.id,
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['dashboard-clients', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user!.id)
      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!user?.id,
  })

  const { data: invoices = [] } = useQuery({
    queryKey: ['dashboard-invoices', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('total_amount, status, issued_date')
        .eq('user_id', user!.id)
      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!user?.id,
  })

  const activeProjects = projects.filter(p => p.status === 'active').length
  const totalClients = clients.length

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyRevenue = invoices
    .filter(inv => {
      const date = new Date(inv.issued_date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && inv.status === 'paid'
    })
    .reduce((sum, inv) => sum + inv.total_amount, 0)

  const unbilledHours = projects
    .filter(p => p.status === 'active' && (p.hours_worked || 0) > 0)
    .reduce((sum, p) => sum + (p.hours_worked || 0), 0)

  const getMonthlyChartData = () => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleString('it-IT', { month: 'short' })
      const year = date.getFullYear()
      
      const revenue = invoices
        .filter(inv => {
          const invDate = new Date(inv.issued_date)
          return invDate.getMonth() === date.getMonth() && 
                 invDate.getFullYear() === year && 
                 inv.status === 'paid'
        })
        .reduce((sum, inv) => sum + inv.total_amount, 0)
      
      months.push({
        mese: `${monthName} ${year}`,
        entrate: revenue
      })
    }
    return months
  }

  const chartData = getMonthlyChartData()

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panoramica</h1>
        <p className="text-muted-foreground">Benvenuto in Freelance Hub</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progetti attivi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clienti totali</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fatturato mese corrente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">€{monthlyRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ore non fatturate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{unbilledHours.toFixed(1)}h</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Andamento entrate (ultimi 6 mesi)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="mese" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip 
                formatter={(value) => [`€${value}`, 'Entrate']}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
              />
              <Line type="monotone" dataKey="entrate" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progetti recenti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.slice(0, 5).map((project) => (
            <div key={project.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{project.name}</p>
                <p className="text-sm text-muted-foreground">{project.clients?.name || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">€{((project.hours_worked || 0) * project.hourly_rate).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  {project.status === 'active' && '🟢 Attivo'}
                  {project.status === 'paused' && '⏸️ In pausa'}
                  {project.status === 'completed' && '✅ Completato'}
                </p>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-muted-foreground text-center py-4">Nessun progetto ancora</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}