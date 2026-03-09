"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [msg, setMsg] = useState("")
  const router = useRouter()

  async function registrar() {
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    })

    if (error) {
      setMsg(error.message)
    } else {
      setMsg("Conta criada com sucesso")
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-zinc-800 p-8 rounded w-96 space-y-4">
        <h1 className="text-xl font-bold">Criar Conta</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-zinc-900"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-2 rounded bg-zinc-900"
        />

        <button
          onClick={registrar}
          className="w-full bg-green-600 py-2 rounded"
        >
          Criar Conta
        </button>

        <p className="text-sm text-red-400">{msg}</p>
      </div>

    </div>
  )
}