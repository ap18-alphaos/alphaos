'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [os, setOs] = useState([])

  async function carregar() {
    const { data } = await supabase
      .from('service_orders')
      .select(`
        id,
        status,
        price,
        reported_issue,
        devices (
          brand,
          model
        )
      `)
      .order('entry_date', { ascending: false })

    setOs(data || [])
  }

  useEffect(() => {
    carregar()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-md mx-auto">

        <h1 className="text-2xl mb-6">Ordens de Serviço</h1>

        <div className="space-y-3">

          {os.map(o => (
            <div key={o.id} className="bg-zinc-900 p-4 rounded">

              <p className="font-semibold">
                {o.devices?.brand} {o.devices?.model}
              </p>

              <p className="text-sm">Defeito: {o.reported_issue}</p>
              <p className="text-sm">Valor: R$ {o.price}</p>
              <p className="text-sm">Status: {o.status}</p>

            </div>
          ))}

        </div>

      </div>
    </div>
  )
}