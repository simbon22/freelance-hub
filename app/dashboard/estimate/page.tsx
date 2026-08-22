/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sparkles, AlertTriangle, Lightbulb, Save } from 'lucide-react'

export default function EstimatePage() {
  const [formData, setFormData] = useState({
    projectType: '',
    screens: 1,
    design: 'template',
    backend: 'none',
    auth: 'none',
    payments: 'none',
    maintenance: 'none',
    team: 'alone',
    deadline: 'normal'
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | {
    estimatedHours: { min: number; max: number; recommended: number }
    recommendedPrice: { min: number; max: number; recommended: number }
    breakdown: { design: number; frontend: number; backend: number; testing: number }
    timeline: string
    risks: string[]
    recommendations: string[]
  }>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (response.ok) {
        setResult(data)
      } else {
        alert('Errore: ' + (data.error || 'Riprova'))
      }
    } catch (error) {
      alert('Errore di connessione')
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stima Preventivo con l&apos;intelligenza artificiale</h1>
        <p className="text-muted-foreground text-sm">Genera preventivi intelligenti basati sui tuoi parametri</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-animate overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base">Parametri progetto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipologia progetto *</Label>
                <Select value={formData.projectType} onValueChange={(v) => updateForm('projectType', v)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sito Web">Sito Web</SelectItem>
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="App Mobile">App Mobile</SelectItem>
                    <SelectItem value="Dashboard">Dashboard / Admin Panel</SelectItem>
                    <SelectItem value="API">API / Backend</SelectItem>
                    <SelectItem value="Landing Page">Landing Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Numero schermate / pagine: {formData.screens}</Label>
                <Input
                  type="range"
                  min="1"
                  max="50"
                  value={formData.screens}
                  onChange={(e) => updateForm('screens', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Design</Label>
                <Select value={formData.design} onValueChange={(v) => updateForm('design', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="template">Template predefinito</SelectItem>
                    <SelectItem value="custom">Personalizzato (su misura)</SelectItem>
                    <SelectItem value="premium">Design premium + UX research</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Backend / Database</Label>
                <Select value={formData.backend} onValueChange={(v) => updateForm('backend', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nessuno (solo frontend)</SelectItem>
                    <SelectItem value="simple">Database semplice (3-5 tabelle)</SelectItem>
                    <SelectItem value="complex">Database complesso + API esterne</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Autenticazione utenti</Label>
                <Select value={formData.auth} onValueChange={(v) => updateForm('auth', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nessuna</SelectItem>
                    <SelectItem value="basic">Login base (email/password)</SelectItem>
                    <SelectItem value="social">Login social (Google, GitHub)</SelectItem>
                    <SelectItem value="2fa">Login + 2FA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pagamenti integrati</Label>
                <Select value={formData.payments} onValueChange={(v) => updateForm('payments', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nessuno</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="both">Entrambi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Manutenzione post-lancio</Label>
                <Select value={formData.maintenance} onValueChange={(v) => updateForm('maintenance', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nessuna</SelectItem>
                    <SelectItem value="3mesi">3 mesi</SelectItem>
                    <SelectItem value="6mesi">6 mesi</SelectItem>
                    <SelectItem value="12mesi">12 mesi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Team coinvolto</Label>
                <Select value={formData.team} onValueChange={(v) => updateForm('team', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alone">Solo io (full stack)</SelectItem>
                    <SelectItem value="designer">Io + designer</SelectItem>
                    <SelectItem value="team">Team completo (designer + backend dev)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Deadline</Label>
                <Select value={formData.deadline} onValueChange={(v) => updateForm('deadline', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">Flessibile (4+ settimane)</SelectItem>
                    <SelectItem value="normal">Normale (2-3 settimane)</SelectItem>
                    <SelectItem value="urgent">Urgente (1 settimana)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full gap-1.5" disabled={loading || !formData.projectType}>
                <Sparkles size={15} />
                {loading ? 'Generazione in corso...' : 'Genera preventivo con AI'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card className="card-animate border-primary/30 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles size={16} className="text-primary" /> Preventivo generato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-accent p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Ore stimate</p>
                  <p className="font-mono text-xl font-bold font-tabular text-accent-foreground">
                    {result.estimatedHours.min} - {result.estimatedHours.max}
                  </p>
                  <p className="text-xs">Consigliate: {result.estimatedHours.recommended}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Prezzo consigliato</p>
                  <p className="font-mono text-xl font-bold font-tabular">
                    €{result.recommendedPrice.min.toLocaleString()} - €{result.recommendedPrice.max.toLocaleString()}
                  </p>
                  <p className="text-xs">Consigliato: €{result.recommendedPrice.recommended.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">Scomposizione ore</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Design:</span><span>{result.breakdown.design}h</span>
                  <span className="text-muted-foreground">Frontend:</span><span>{result.breakdown.frontend}h</span>
                  <span className="text-muted-foreground">Backend:</span><span>{result.breakdown.backend}h</span>
                  <span className="text-muted-foreground">Testing:</span><span>{result.breakdown.testing}h</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Timeline stimata</p>
                <p className="text-sm text-muted-foreground">{result.timeline}</p>
              </div>

              {result.risks.length > 0 && (
                <div className="bg-amber-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle size={14} /> Rischi da considerare
                  </p>
                  <ul className="text-sm text-amber-700/90 dark:text-amber-400/90 mt-1 list-disc list-inside">
                    {result.risks.map((risk, i) => <li key={i}>{risk}</li>)}
                  </ul>
                </div>
              )}

              <div className="bg-accent p-3 rounded-lg">
                <p className="text-sm font-medium text-accent-foreground flex items-center gap-1.5">
                  <Lightbulb size={14} /> Raccomandazioni
                </p>
                <ul className="text-sm text-accent-foreground/90 mt-1 list-disc list-inside">
                  {result.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
              </div>

              <Button variant="outline" className="w-full gap-1.5" onClick={() => alert('Salvataggio preventivo (prossimamente)')}>
                <Save size={14} />
                Salva questo preventivo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}