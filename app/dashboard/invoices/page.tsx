/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useInvoices } from '@/hooks/use-invoices'
import { useProjects } from '@/hooks/use-projects'
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
import { Plus, CheckCircle2, Clock3, AlertTriangle } from 'lucide-react'

export default function InvoicesPage() {
  const [open, setOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [dueDate, setDueDate] = useState('')

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser()
      return data.user
    },
  })

  const { projects } = useProjects(user?.id)
  const { invoices, isLoading, addInvoice, isAdding, updateInvoice } = useInvoices(user?.id)

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear()
    const count = invoices.length + 1
    return `INV-${year}-${count.toString().padStart(3, '0')}`
  }

  const handleCreateInvoice = () => {
    if (!selectedProjectId || !user) return

    const project = projects.find(p => p.id === selectedProjectId)
    if (!project) return

    const hoursWorked = project.hours_worked || 0
    const totalAmount = hoursWorked * project.hourly_rate

    addInvoice({
      project_id: project.id,
      client_id: project.client_id,
      invoice_number: generateInvoiceNumber(),
      hours_worked: hoursWorked,
      hourly_rate: project.hourly_rate,
      total_amount: totalAmount,
      status: 'pending',
      issued_date: new Date().toISOString().split('T')[0],
      due_date: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paid_date: null,
      notes: null,
      user_id: user.id,
    })

    setSelectedProjectId('')
    setDueDate('')
    setOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-primary/10 text-primary">
            <CheckCircle2 size={12} /> Pagata
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock3 size={12} /> In attesa
          </span>
        )
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-destructive/10 text-destructive">
            <AlertTriangle size={12} /> Scaduta
          </span>
        )
      default:
        return null
    }
  }

  if (isLoading) return <div className="p-8 text-center">Caricamento fatture...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fatture</h1>
          <p className="text-muted-foreground text-sm">Gestisci le tue fatture</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1.5"><Plus size={15} /> Nuova fattura</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuova fattura</DialogTitle>
              <DialogDescription>
                Seleziona un progetto con ore lavorate
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Progetto</Label>
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona progetto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects
                      .filter(p => (p.hours_worked || 0) > 0)
                      .map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name} - {(project.hours_worked || 0)} ore × €{project.hourly_rate}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data scadenza</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
              <Button onClick={handleCreateInvoice} disabled={isAdding || !selectedProjectId}>
                {isAdding ? 'Creazione...' : 'Crea fattura'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {invoices.map((invoice, index) => (
          <Card
            key={invoice.id}
            className="card-animate card-hover overflow-hidden"
            style={{ animationDelay: `${index * 0.04}s` }}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{invoice.invoice_number}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {invoice.projects?.name || 'N/A'}
                  </p>
                </div>
                {getStatusBadge(invoice.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="text-muted-foreground">Cliente:</span>{' '}
                {invoice.clients?.name || 'N/A'}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Importo:</span>{' '}
                <span className="font-mono font-semibold font-tabular">€{invoice.total_amount.toFixed(2)}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Scadenza:</span>{' '}
                {invoice.due_date}
              </div>
              {invoice.paid_date && (
                <div className="text-sm text-primary">
                  Pagata il: {invoice.paid_date}
                </div>
              )}
              <Select
                value={invoice.status}
                onValueChange={(value) => {
                  const status = value as 'pending' | 'paid' | 'overdue'
                  const updates: any = { status }
                  if (status === 'paid') {
                    updates.paid_date = new Date().toISOString().split('T')[0]
                  }
                  updateInvoice({ id: invoice.id, updates })
                }}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">In attesa</SelectItem>
                  <SelectItem value="paid">Pagata</SelectItem>
                  <SelectItem value="overdue">Scaduta</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))}

        {invoices.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Nessuna fattura. Clicca &quot;Nuova fattura&quot; per creare la prima.
          </div>
        )}
      </div>
    </div>
  )
}