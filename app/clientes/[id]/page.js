'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function Cliente() {
  const { id } = useParams()

  const [cliente, setCliente] = useState(null)

  async function carregar() {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    setCliente(data)
  }

  useEffect(() => {
    if (id) carregar()
  }, [id])

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

        <button
          onClick={async () => {
            await supabase.from('clients').delete().eq('id', id)
            window.location.href = '/clientes'
          }}
          className="w-full bg-red-600 hover:bg-red-700 p-3 rounded"
        >
          Excluir Cliente
        </button>

        <a href="/clientes" className="text-blue-400 underline block text-center">
          Voltar
        </a>

      </div>
    </div>
  )
}