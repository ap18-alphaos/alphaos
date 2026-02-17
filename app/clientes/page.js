'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Clientes() {
  const [clientes, setClientes] = useState([])

  async function carregarClientes() {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('name')

    setClientes(data || [])
  }

  useEffect(() => {
    carregarClientes()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-md mx-auto">

        <h1 className="text-2xl mb-6">Clientes</h1>

        <div className="space-y-3">

          {clientes.map((c) => (
            <div
              key={c.id}
              className="bg-zinc-900 border border-zinc-800 p-4 rounded"
            >

              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-zinc-400">{c.phone}</p>

            </div>
          ))}

        </div>

      </div>
    </div>
  )
}