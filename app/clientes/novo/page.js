'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovoCliente() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  async function salvar() {
    const { error } = await supabase
      .from('clients')
      .insert([{ name, phone, address }])

    if (!error) router.push('/clientes')
    else alert('Erro ao salvar')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-md mx-auto space-y-4">

        <h1 className="text-2xl">Novo Cliente</h1>

        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded bg-zinc-900 border border-zinc-800"
        />

        <input
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 rounded bg-zinc-900 border border-zinc-800"
        />

        <input
          placeholder="Endereço"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 rounded bg-zinc-900 border border-zinc-800"
        />

        <button
          onClick={salvar}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded"
        >
          Salvar
        </button>

      </div>
    </div>
  )
}