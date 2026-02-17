'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function Cliente({ params }) {
  const { id } = params
  const [cliente, setCliente] = useState(null)

  async function carregarCliente() {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    setCliente(data)
  }

  useEffect(() => {
    carregarCliente()
  }, [])

  if (!cliente) return <p className="text-white p-6">Carregando...</p>

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-md mx-auto space-y-4">

        <h1 className="text-2xl">Cliente</h1>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded">
          <p><b>Nome:</b> {cliente.name}</p>
          <p><b>Telefone:</b> {cliente.phone}</p>
          <p><b>Endereço:</b> {cliente.address}</p>
        </div>

        <a href="/clientes" className="text-blue-400 underline">
          Voltar
        </a>

      </div>
    </div>
  )
}