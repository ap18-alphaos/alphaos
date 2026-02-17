'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function OS() {
  const [ordens, setOrdens] = useState([])

  async function carregar() {
    const { data } = await supabase
      .from('service_orders')
      .select(`
        id,
        status,
        price,
        defect,
        devices (
          brand,
          model
        ),
        clients (
          name
        )
      `)
      .order('entry_date', { ascending: false })

    setOrdens(data || [])
  }

  useEffect(() => {
    carregar()
  }, [])

  return (
    <div className="p-8">

      <h1 className="text-2xl mb-6">Ordens de Serviço</h1>

      <Link
        href="/os/nova"
        className="inline-block bg-green-600 p-3 rounded mb-6"
      >
        + Nova OS
      </Link>

      <div className="space-y-3">

        {ordens.map(o => (
          <Link
            key={o.id}
            href={`/os/${o.id}`}
          >
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded hover:bg-zinc-800 cursor-pointer">

              <p className="font-semibold">
                {o.devices?.brand} {o.devices?.model}
              </p>

              <p className="text-sm text-zinc-400">
                Cliente: {o.clients?.name}
              </p>

              <p className="text-sm text-zinc-400">
                Status: {o.status} — R$ {o.price}
              </p>

            </div>
          </Link>
        ))}

      </div>

    </div>
  )
}