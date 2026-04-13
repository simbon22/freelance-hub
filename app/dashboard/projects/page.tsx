/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useProjects } from '@/hooks/use-projects'
import { Client } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const fetchClients = async (userId: string) => {
  const { data, error } = await supabase
    .from('clients')
    .select('id, name')
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  return data as Pick<Client, 'id' | 'name'>[]
}

export default function ProjectsPage() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [clientId, setClientId] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [estimatedHours, setEstimatedHours] = useState('')
  const [tempHours, setTempHours] = useState<Record<string, number>>({})
  const [tempCosts, setTempCosts] = useState<Record<string, number>>({})

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser()
      return data.user
    },
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients-dropdown', user?.id],
    queryFn: () => fetchClients(user!.id),
    enabled: !!user?.id,
  })

  const { projects, isLoading, addProject, isAdding, updateProject, deleteProject } = useProjects(user?.id)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !clientId || !hourlyRate || !user) return

    addProject({
      name,
      client_id: clientId,
      hourly_rate: parseFloat(hourlyRate),
      estimated_hours: estimatedHours ? parseFloat(estimatedHours) : null,
      status: 'active',
      user_id: user.id,
      hours_worked: null,
      external_costs: null
    })

    setName('')
    setClientId('')
    setHourlyRate('')
    setEstimatedHours('')
    setOpen(false)
  }

  if (isLoading) return <div className="p-8 text-center">Caricamento progetti...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progetti</h1>
          <p className="text-muted-foreground">Gestisci i tuoi progetti</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="btn-glow">+ Nuovo progetto</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Nuovo progetto</DialogTitle>
                <DialogDescription>
                  Inserisci i dati del progetto
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome progetto *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sito web Mario Rossi"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cliente *</Label>
                  <Select value={clientId} onValueChange={setClientId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Tariffa oraria (€) *</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.01"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedHours">Ore preventivate (opzionale)</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    step="0.5"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    placeholder="40"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit" disabled={isAdding} className="btn-glow">
                  {isAdding ? 'Creazione...' : 'Crea progetto'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => {
          const revenue = (project.hours_worked || 0) * project.hourly_rate
          const costs = project.external_costs || 0
          const profit = revenue - costs
          const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0

          return (
            <Card 
              key={project.id} 
              className="card-glow card-animate overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {project.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <Select
                    value={project.status}
                    onValueChange={(value) => updateProject({ id: project.id, updates: { status: value as any } })}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">🟢 Attivo</SelectItem>
                      <SelectItem value="paused">⏸️ Pausa</SelectItem>
                      <SelectItem value="completed">✅ Completato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardTitle className="mt-3">{project.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Cliente: {project.clients?.name || 'N/A'}
                </p>
                <p className="text-sm font-medium">
                  Tariffa: €{project.hourly_rate}/ora
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.estimated_hours && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Preventivo:</span>{' '}
                    {project.estimated_hours} ore
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Label className="text-sm">Ore lavorate:</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={tempHours[project.id] ?? project.hours_worked ?? 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val)) setTempHours(prev => ({ ...prev, [project.id]: val }))
                    }}
                    className="w-24 h-8 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="btn-glow"
                    onClick={() => {
                      const newHours = tempHours[project.id]
                      if (newHours !== undefined && newHours !== project.hours_worked) {
                        updateProject({ id: project.id, updates: { hours_worked: newHours } })
                        setTempHours(prev => { const newState = { ...prev }; delete newState[project.id]; return newState })
                      }
                    }}
                  >
                    Salva
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm">Costi esterni (€):</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={tempCosts[project.id] ?? project.external_costs ?? 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val)) setTempCosts(prev => ({ ...prev, [project.id]: val }))
                    }}
                    className="w-24 h-8 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="btn-glow"
                    onClick={() => {
                      const newCosts = tempCosts[project.id]
                      if (newCosts !== undefined && newCosts !== (project.external_costs || 0)) {
                        updateProject({ id: project.id, updates: { external_costs: newCosts } })
                        setTempCosts(prev => { const newState = { ...prev }; delete newState[project.id]; return newState })
                      }
                    }}
                  >
                    Salva
                  </Button>
                </div>

                <div className="pt-3 mt-2 border-t">
                  <p className="text-sm font-semibold mb-2">📊 Profitto</p>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <span className="text-muted-foreground">Ricavo:</span>
                    <span>€{revenue.toFixed(2)}</span>
                    <span className="text-muted-foreground">Margine netto:</span>
                    <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      €{profit.toFixed(2)} ({profitMargin.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    if (confirm('Eliminare questo progetto?')) {
                      deleteProject(project.id)
                    }
                  }}
                >
                  Elimina progetto
                </Button>
              </CardContent>
            </Card>
          )
        })}

        {projects.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Nessun progetto. Clicca &quot;Nuovo progetto&quot; per iniziare.
          </div>
        )}
      </div>
    </div>
  )
}