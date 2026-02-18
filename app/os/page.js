'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function OSPage() {
  const [os, setOs] = useState([])

  async function carregar() {
    const { data, error } = await supabase
      .from('service_orders')
      .select(`
        id,
        status,
        price,
        defect,
        devices (brand, model),
        clients (name)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setOs(data || [])
  }

  useEffect(() => {
    carregar()
  }, [])

  return (
    <div className="p-8 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Ordens de Serviço</h1>

        <Link
          href="/os/nova"
          className="bg-green-600 px-4 py-2 rounded"
        >
          + Nova OS
        </Link>
      </div>

      <div className="space-y-3">

        {os.map(o => (
          <div
            key={o.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded"
          >
            <p className="font-semibold">
              {o.clients?.name} — {o.devices?.brand} {o.devices?.model}
            </p>

            <p className="text-sm text-zinc-400">
              Defeito: {o.defect}
            </p>

            <p className="text-sm text-zinc-400">
              Status: {o.status}
            </p>

            <p className="text-sm text-zinc-400">
              Valor: R$ {o.price}
            </p>
          </div>
        ))}

      </div>

    </div>
  )
}