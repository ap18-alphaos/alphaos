'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function OSDetalhe() {
  const { id } = useParams()
  const router = useRouter()

  const [os, setOs] = useState(null)
  const [status, setStatus] = useState('')

  async function carregar() {
    const { data } = await supabase
      .from('service_orders')
      .select(`
        *,
        devices (brand, model),
        clients (name)
      `)
      .eq('id', id)
      .maybeSingle()

    setOs(data)
    setStatus(data?.status || '')
  }

  async function atualizarStatus() {
    await supabase
      .from('service_orders')
      .update({ status })
      .eq('id', id)

    carregar()
  }

  async function excluir() {
    await supabase
      .from('service_orders')
      .delete()
      .eq('id', id)

    router.push('/os')
  }

  useEffect(() => {
    if (id) carregar()
  }, [id])

  if (!os) return <p className="p-8">Carregando...</p>

  return (
    <div className="p-8 max-w-md space-y-4">

      <h1 className="text-2xl">Ordem de Serviço</h1>

      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded space-y-2">
        <p><b>Cliente:</b> {os.clients?.name}</p>
        <p><b>Aparelho:</b> {os.devices?.brand} {os.devices?.model}</p>
        <p><b>Defeito:</b> {os.defect}</p>
        <p><b>Valor:</b> R$ {os.price}</p>
      </div>

      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded"
      >
        <option>Recebido</option>
        <option>Em análise</option>
        <option>Aguardando peça</option>
        <option>Em reparo</option>
        <option>Finalizado</option>
        <option>Entregue</option>
      </select>

      <button
        onClick={atualizarStatus}
        className="w-full bg-blue-600 p-3 rounded"
      >
        Atualizar Status
      </button>

      <button
        onClick={excluir}
        className="w-full bg-red-600 p-3 rounded"
      >
        Excluir OS
      </button>

      <button
        onClick={() => router.push('/os')}
        className="w-full bg-zinc-700 p-3 rounded"
      >
        Voltar
      </button>

    </div>
  )
}