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
        defect,
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
    <div className="p-6">

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl">Ordens de Serviço</h1>

        <Link href="/os/nova">
          <button className="bg-green-600 px-4 py-2 rounded">
            + Nova OS
          </button>
        </Link>
      </div>

      <div className="space-y-3">

        {os.map(o => (
          <div key={o.id} className="border p-3 rounded bg-zinc-900">

            <p className="font-bold">
              {o.clients?.name}
            </p>

            <p>
              {o.devices?.brand} {o.devices?.model}
            </p>

            <p>Status: {o.status}</p>
            <p>Valor: R$ {o.price}</p>
            <p>Defeito: {o.defect}</p>

          </div>
        ))}

      </div>

    </div>
  )
}