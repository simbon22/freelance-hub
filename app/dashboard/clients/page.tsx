'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { generateReportPDF } from '@/lib/generateReportPDF'
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

type Client = {
  id: string
  name: string
  email: string
  phone: string
}

const generateClientReport = async (clientId: string, clientName: string, clientEmail: string, userId: string) => {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('name, hours_worked, hourly_rate')
    .eq('client_id', clientId)
    .eq('user_id', userId)

  if (error || !projects) {
    alert('Errore nel recupero dei dati')
    return
  }

  const projectsWithHours = projects.filter(p => (p.hours_worked || 0) > 0)

  if (projectsWithHours.length === 0) {
    alert('Nessun progetto con ore lavorate per questo cliente')
    return
  }

  const reportData = {
    clientName,
    clientEmail,
    periodStart: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
    projects: projectsWithHours.map(p => ({
      name: p.name,
      hours: p.hours_worked || 0,
      rate: p.hourly_rate,
      total: (p.hours_worked || 0) * p.hourly_rate
    })),
    totalHours: projectsWithHours.reduce((sum, p) => sum + (p.hours_worked || 0), 0),
    totalAmount: projectsWithHours.reduce((sum, p) => sum + ((p.hours_worked || 0) * p.hourly_rate), 0)
  }

  generateReportPDF(reportData)
}

const fetchClients = async (userId: string) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  return data as Client[]
}

export default function ClientsPage() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const queryClient = useQueryClient()

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser()
      return data.user
    },
  })

  const {
    data: clients = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['clients', user?.id],
    queryFn: () => fetchClients(user!.id),
    enabled: !!user?.id,
  })

  const addClientMutation = useMutation({
    mutationFn: async (newClient: { name: string; email: string; phone: string; user_id: string }) => {
      const { error } = await supabase.from('clients').insert([newClient])
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', user?.id] })
      setName('')
      setEmail('')
      setPhone('')
      setOpen(false)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !user) return
    addClientMutation.mutate({ name, email, phone, user_id: user.id })
  }

  if (isLoading) return <div className="p-8 text-center">Caricamento clienti...</div>
  if (error) return <div>Errore: {error.message}</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clienti</h1>
          <p className="text-muted-foreground">Gestisci i tuoi clienti</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="btn-glow">+ Nuovo cliente</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Nuovo cliente</DialogTitle>
                <DialogDescription>
                  Inserisci i dati del cliente
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mario Rossi"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mario@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+39 123 456 7890"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit" disabled={addClientMutation.isPending} className="btn-glow">
                  {addClientMutation.isPending ? 'Salvataggio...' : 'Salva cliente'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client, index) => (
          <Card 
            key={client.id} 
            className="card-glow card-animate overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <CardTitle className="mt-3">{client.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {client.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {client.email}
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {client.phone}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full btn-glow"
                onClick={() => generateClientReport(client.id, client.name, client.email, user!.id)}
              >
                📄 Genera Report
              </Button>
            </CardContent>
          </Card>
        ))}
        {clients.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Nessun cliente. Clicca &quot;Nuovo cliente&quot; per iniziare.
          </div>
        )}
      </div>
    </div>
  )
}