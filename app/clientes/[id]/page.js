'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Sidebar from '../../../components/Sidebar'
import AuthGuard from '../../../components/AuthGuard'
import { useParams } from 'next/navigation'

export default function ClienteDetalhe() {
  const { id } = useParams()

  const [cliente, setCliente] = useState(null)
  const [aparelhos, setAparelhos] = useState([])
  const [os, setOs] = useState([])

  async function carregarTudo() {
    const { data: c } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    setCliente(c)

    const { data: d } = await supabase
      .from('devices')
      .select('*')
      .eq('client_id', id)

    setAparelhos(d || [])

    const { data: o } = await supabase
      .from('service_orders')
      .select(`
        id,
        order_number,
        status,
        price,
        devices (
          id
        )
      `)

    const filtradas = (o || []).filter(x =>
      d?.some(dev => dev.id === x.devices?.id)
    )

    setOs(filtradas)
  }

  useEffect(() => {
    carregarTudo()
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-950 text-white flex">

        <Sidebar />

        <div className="ml-48 p-6 w-full">

          <h1 className="text-2xl mb-4">{cliente?.name}</h1>

          <h2 className="text-lg mt-6 mb-2">Aparelhos</h2>

          {aparelhos.map(a => (
            <div key={a.id} className="bg-zinc-900 p-3 mb-2 rounded">
              {a.brand} {a.model}
            </div>
          ))}

          <h2 className="text-lg mt-6 mb-2">Ordens de Serviço</h2>

          {os.map(o => (
            <div key={o.id} className="bg-zinc-900 p-3 mb-2 rounded">
              OS #{String(o.order_number).padStart(6,'0')} — {o.status} — R$ {o.price}
            </div>
          ))}

        </div>

      </div>
    </AuthGuard>
  )
}