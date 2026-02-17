'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function Cliente({ params }) {
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)

  async function carregarCliente() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', params.id)
      .maybeSingle()

    if (error) {
      console.error(error)
    }

    setCliente(data)
    setLoading(false)
  }

  useEffect(() => {
    if (params?.id) {
      carregarCliente()
    }
  }, [params])

  if (loading) {
    return <p className="text-white p-6">Carregando...</p>
  }

  if (!cliente) {
    return <p className="text-red-400 p-6">Cliente não encontrado.</p>
  }

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