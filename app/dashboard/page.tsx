'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import {
  FolderKanban,
  Users,
  Clock,
} from 'lucide-react'
import {
  getActiveProjectsCount,
  getTotalClientsCount,
  getMonthlyRevenue,
  getUnbilledHours,
  getMonthlyChartData
} from '@/lib/dashboard-calculations'

const statusMeta: Record<string, { label: string; color: string }> = {
  active: { label: 'Attivo', color: 'bg-primary' },
  paused: { label: 'In pausa', color: 'bg-amber-500' },
  completed: { label: 'Completato', color: 'bg-muted-foreground' },
}

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

  // Calcoli usando le funzioni testate
  const activeProjects = getActiveProjectsCount(projects)
  const totalClients = getTotalClientsCount(clients)
  const monthlyRevenue = getMonthlyRevenue(invoices)
  const unbilledHours = getUnbilledHours(projects)
  const chartData = getMonthlyChartData(invoices)

  if (!user) return null

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Panoramica</h1>
        <p className="text-muted-foreground text-sm">Benvenuto in Freelance Hub</p>
      </div>

      <Card className="card-animate">
        <CardContent className="pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Fatturato mese corrente
          </p>
          <div className="font-mono text-4xl font-semibold font-tabular tracking-tight text-primary">
            €{monthlyRevenue.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="card-animate" style={{ animationDelay: '0.05s' }}>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <FolderKanban size={16} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Progetti attivi</p>
              <div className="font-mono text-lg font-semibold font-tabular">{activeProjects}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-animate" style={{ animationDelay: '0.1s' }}>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <Users size={16} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Clienti totali</p>
              <div className="font-mono text-lg font-semibold font-tabular">{totalClients}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-animate" style={{ animationDelay: '0.15s' }}>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <Clock size={16} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Ore non fatturate</p>
              <div className="font-mono text-lg font-semibold font-tabular">{unbilledHours.toFixed(1)}h</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Andamento entrate</CardTitle>
          <p className="text-xs text-muted-foreground">Ultimi 6 mesi</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="mese" className="text-xs" tickLine={false} axisLine={false} />
              <YAxis className="text-xs" tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value) => [`€${value}`, 'Entrate']}
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 8, fontSize: 12.5 }}
              />
              <Area
                type="monotone"
                dataKey="entrate"
                stroke="var(--primary)"
                strokeWidth={2.25}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progetti recenti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {projects.slice(0, 5).map((project) => {
            const meta = statusMeta[project.status] ?? statusMeta.active
            return (
              <div key={project.id} className="flex justify-between items-center py-2 px-2 -mx-2 rounded-lg hover:bg-muted/60">
                <div>
                  <p className="font-medium text-sm">{project.name}</p>
                  <p className="text-xs text-muted-foreground">{project.clients?.name || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-tabular">€{((project.hours_worked || 0) * project.hourly_rate).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground flex items-center justify-end gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.color}`} />
                    {meta.label}
                  </p>
                </div>
              </div>
            )
          })}
          {projects.length === 0 && (
            <p className="text-muted-foreground text-center py-4 text-sm">Nessun progetto ancora</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
