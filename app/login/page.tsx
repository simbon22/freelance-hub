'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setMessage(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  const handleSignUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Registrazione completata! Ora puoi fare login.')
    }
  }

  const handleDemo = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: 'demo@freelancehub.com',
      password: 'Demo123456'
    })
    setLoading(false)
    if (error) {
      setMessage('Demo non disponibile. Riprova più tardi.')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">FH</span>
          </div>
          <CardTitle className="text-2xl">Freelance Hub</CardTitle>
          <CardDescription>
            Accedi per gestire i tuoi progetti, clienti e fatture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tuo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          {message && (
            <div className="text-sm text-center text-muted-foreground bg-muted p-2 rounded">
              {message}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={handleLogin} 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Caricamento...' : 'Accedi'}
          </Button>
          <Button 
            onClick={handleSignUp} 
            variant="outline" 
            className="w-full"
            disabled={loading}
          >
            Registrati
          </Button>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                oppure
              </span>
            </div>
          </div>
          <Button 
            onClick={handleDemo} 
            variant="secondary" 
            className="w-full"
            disabled={loading}
          >
            🎬 Prova la demo
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}