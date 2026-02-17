'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const [stats, setStats] = useState({
    os: 0,
    clientes: 0,
    aparelhos: 0,
    faturamento: 0
  })

  async function carregarDados() {
    const { data: os } = await supabase.from('service_orders').select('*')
    const { data: clientes } = await supabase.from('clients').select('*')
    const { data: aparelhos } = await supabase.from('devices').select('*')

    const faturamento = os?.reduce((total, o) => total + (o.price || 0), 0) || 0

    setStats({
      os: os?.length || 0,
      clientes: clientes?.length || 0,
      aparelhos: aparelhos?.length || 0,
      faturamento
    })
  }

  useEffect(() => {
    carregarDados()
  }, [])

  return (
    <div className="p-8">

      <h1 className="text-2xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">

        <div className="bg-zinc-900 p-6 rounded border border-zinc-800">
          <p className="text-sm text-zinc-400">Ordens de Serviço</p>
          <p className="text-2xl">{stats.os}</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded border border-zinc-800">
          <p className="text-sm text-zinc-400">Clientes</p>
          <p className="text-2xl">{stats.clientes}</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded border border-zinc-800">
          <p className="text-sm text-zinc-400">Aparelhos</p>
          <p className="text-2xl">{stats.aparelhos}</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded border border-zinc-800">
          <p className="text-sm text-zinc-400">Faturamento</p>
          <p className="text-2xl">R$ {stats.faturamento}</p>
        </div>

      </div>

      <div className="space-y-3">

        <Link href="/clientes" className="block bg-blue-600 p-3 rounded text-center hover:bg-blue-700">
          Gerenciar Clientes
        </Link>

        <Link href="/os" className="block bg-green-600 p-3 rounded text-center hover:bg-green-700">
          Gerenciar Ordens de Serviço
        </Link>

      </div>

    </div>
  )
}