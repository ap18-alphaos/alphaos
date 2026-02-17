'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e) {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) alert(error.message)
    else window.location.href = '/dashboard'
  }

  async function logout() {
    await supabase.auth.signOut()
    alert('Logout realizado')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">

      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded w-80">

        <h1 className="text-xl mb-4">Login AlphaOS</h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 bg-zinc-800 border-zinc-700"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="border p-2 w-full mb-3 bg-zinc-800 border-zinc-700"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-white text-black w-full py-2 rounded">
          Entrar
        </button>

      </form>

      <button onClick={logout} className="mt-4 text-sm text-zinc-400">
        Logout
      </button>

    </div>
  )
}