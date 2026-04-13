'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Login riuscito!')
      router.push('/dashboard')  // ← REINDIRIZZO
    }
  }

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Registrazione completata! Ora puoi fare login.')
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Login / SignUp</h1>
      <input
        className="border p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-2">
        <button onClick={handleLogin} className="bg-black text-white p-2">
          Login
        </button>
        <button onClick={handleSignUp} className="bg-gray-700 text-white p-2">
          Sign Up
        </button>
      </div>
      {message && <div>{message}</div>}
    </div>
  )
}