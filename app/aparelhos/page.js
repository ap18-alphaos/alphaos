'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function Aparelhos() {
  const [devices, setDevices] = useState([])

  async function carregar() {
    const { data } = await supabase
      .from('devices')
      .select(`
        id,
        brand,
        model,
        imei,
        clients (
          name
        )
      `)

    setDevices(data || [])
  }

  useEffect(() => {
    carregar()
  }, [])

  return (
    <div className="p-8">

      <h1 className="text-2xl mb-6">Aparelhos</h1>

      <Link href="/aparelhos/novo" className="inline-block bg-green-600 p-3 rounded mb-6">
        + Novo Aparelho
      </Link>

      <div className="space-y-3">

        {devices.map(d => (
          <div
            key={d.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded"
          >

            <p className="font-semibold">
              {d.brand} {d.model}
            </p>

            <p className="text-sm text-zinc-400">IMEI: {d.imei}</p>
            <p className="text-sm text-zinc-400">Cliente: {d.clients?.name}</p>

          </div>
        ))}

      </div>

    </div>
  )
}