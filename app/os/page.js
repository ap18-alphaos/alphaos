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
        devices (
          brand,
          model
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
          <div
            key={o.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded"
          >
            <p className="font-semibold">
              {o.devices?.brand} {o.devices?.model}
            </p>

            <p className="text-sm text-zinc-400">
              Status: {o.status} — R$ {o.price}
            </p>
          </div>
        ))}

      </div>

    </div>
  )
}