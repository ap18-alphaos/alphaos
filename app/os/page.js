'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function OSPage() {
  const [os, setOs] = useState([])

  async function carregar() {
    const { data } = await supabase
      .from('service_orders')
      .select(`
        id,
        status,
        price,
        devices(brand,model),
        clients(name)
      `)
      .order('entry_date', { ascending: false })

    setOs(data || [])
  }

  useEffect(() => {
    carregar()
  }, [])

  return (
    <div className="p-8 max-w-3xl mx-auto text-white">

      <div className="flex justify-between mb-6">
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
          <Link
            key={o.id}
            href={`/os/${o.id}`}
            className="block bg-zinc-900 border border-zinc-800 p-4 rounded hover:bg-zinc-800"
          >
            <p className="font-semibold">
              {o.devices?.brand} {o.devices?.model}
            </p>

            <p className="text-sm text-zinc-400">
              Cliente: {o.clients?.name}
            </p>

            <p className="text-sm text-zinc-400">
              Status: {o.status} — R$ {o.price}
            </p>
          </Link>
        ))}

      </div>
    </div>
  )
}