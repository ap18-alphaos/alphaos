'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Clientes() {
  const [clientes, setClientes] = useState([])

  async function carregarClientes() {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    setClientes(data || [])
  }

  useEffect(() => {
    carregarClientes()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-md mx-auto">

        <h1 className="text-2xl mb-6">Clientes</h1>

        <a
          href="/clientes/novo"
          className="block bg-green-600 hover:bg-green-700 p-3 rounded text-center mb-4"
        >
          + Novo Cliente
        </a>

        <div className="space-y-3">

          {clientes.map((c) => (
            <a
              key={c.id}
              href={`/clientes/${c.id}`}
              className="block bg-zinc-900 border border-zinc-800 p-4 rounded hover:bg-zinc-800"
            >
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-zinc-400">{c.phone}</p>
            </a>
          ))}

        </div>

      </div>
    </div>
  )
}