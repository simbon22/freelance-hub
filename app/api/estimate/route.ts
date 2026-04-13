import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { projectType, screens, design, backend, auth, payments, maintenance, team, deadline } = await request.json()

    const prompt = `
Sei un consulente esperto per freelance. Basandoti sui seguenti parametri, genera una stima dettagliata per un progetto.

Parametri:
- Tipologia: ${projectType}
- Numero schermate/pagine: ${screens}
- Design: ${design === 'template' ? 'Template predefinito' : design === 'custom' ? 'Personalizzato su misura' : 'Premium + UX research'}
- Backend: ${backend === 'none' ? 'Nessuno' : backend === 'simple' ? 'Database semplice (3-5 tabelle)' : 'Database complesso + API esterne'}
- Autenticazione: ${auth === 'none' ? 'Nessuna' : auth === 'basic' ? 'Login base' : auth === 'social' ? 'Login social' : 'Login + 2FA'}
- Pagamenti: ${payments === 'none' ? 'Nessuno' : payments === 'paypal' ? 'PayPal' : payments === 'stripe' ? 'Stripe' : 'PayPal e Stripe'}
- Manutenzione post-lancio: ${maintenance === 'none' ? 'Nessuna' : maintenance === '3mesi' ? '3 mesi' : maintenance === '6mesi' ? '6 mesi' : '12 mesi'}
- Team: ${team === 'alone' ? 'Solo full stack' : team === 'designer' ? 'Full stack + designer' : 'Team completo (designer + backend)'}
- Deadline: ${deadline === 'flexible' ? 'Flessibile (4+ settimane)' : deadline === 'normal' ? 'Normale (2-3 settimane)' : 'Urgente (1 settimana)'}

Rispondi SOLO con un oggetto JSON in questo formato esatto, senza altro testo:
{
  "estimatedHours": { "min": 40, "max": 60, "recommended": 50 },
  "recommendedPrice": { "min": 2000, "max": 3000, "recommended": 2500 },
  "breakdown": { "design": 10, "frontend": 20, "backend": 15, "testing": 5 },
  "timeline": "2-3 settimane",
  "risks": ["Rischio 1", "Rischio 2"],
  "recommendations": ["Consiglio 1", "Consiglio 2"]
}

Usa numeri realistici in base ai parametri. Per la timeline, scegli tra: "1 settimana", "2 settimane", "3-4 settimane", "1-2 mesi", "2-3 mesi".
`

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
    })

    const text = completion.choices[0]?.message?.content || ''
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Formato risposta non valido' }, { status: 500 })
    }

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (error) {
    console.error('Errore:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore sconosciuto' },
      { status: 500 }
    )
  }
}