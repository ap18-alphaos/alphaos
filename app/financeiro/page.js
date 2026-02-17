'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'
import AuthGuard from '../../components/AuthGuard'

export default function Financeiro() {
  const [entradas, setEntradas] = useState([])
  const [totalDia, setTotalDia] = useState(0)
  const [totalMes, setTotalMes] = useState(0)

  async function carregarFinanceiro() {
    const { data } = await supabase
      .from('financial_entries')
      .select('*')
      .order('created_at', { ascending: false })

    const hoje = new Date().toISOString().slice(0,10)

    let somaDia = 0
    let somaMes = 0
    const mesAtual = hoje.slice(0,7)

    data?.forEach(e => {
      const dataLanc = e.created_at.slice(0,10)
      const mesLanc = e.created_at.slice(0,7)

      if (dataLanc === hoje) somaDia += Number(e.amount)
      if (mesLanc === mesAtual) somaMes += Number(e.amount)
    })

    setEntradas(data || [])
    setTotalDia(somaDia)
    setTotalMes(somaMes)
  }

  useEffect(() => {
    carregarFinanceiro()
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-950 text-white flex">

        <Sidebar />

        <div className="ml-48 p-6 w-full">

          <h1 className="text-2xl mb-6">Financeiro</h1>

          <div className="flex gap-6 mb-6">

            <div className="bg-zinc-900 p-4 rounded">
              <p className="text-zinc-400">Hoje</p>
              <p className="text-xl font-bold">R$ {totalDia}</p>
            </div>

            <div className="bg-zinc-900 p-4 rounded">
              <p className="text-zinc-400">Mês</p>
              <p className="text-xl font-bold">R$ {totalMes}</p>
            </div>

          </div>

          <h2 className="mb-3">Movimentações</h2>

          {entradas.map(e => (
            <div key={e.id} className="bg-zinc-900 p-3 mb-2 rounded">
              <p>{e.description}</p>
              <p className="text-sm text-zinc-400">
                R$ {e.amount} — {new Date(e.created_at).toLocaleString()}
              </p>
            </div>
          ))}

        </div>

      </div>
    </AuthGuard>
  )
}