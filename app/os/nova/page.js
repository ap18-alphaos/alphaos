'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovaOS() {
  const router = useRouter()

  const [aparelhos, setAparelhos] = useState([])
  const [deviceId, setDeviceId] = useState('')
  const [reportedIssue, setReportedIssue] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [serviceDone, setServiceDone] = useState('')
  const [price, setPrice] = useState('')

  async function carregar() {
    const { data } = await supabase.from('devices').select('*')
    setAparelhos(data || [])
  }

  async function salvar() {
    const { error } = await supabase.from('service_orders').insert([{
      device_id: deviceId,
      reported_issue: reportedIssue,
      diagnosis,
      service_done: serviceDone,
      status: 'Recebido',
      price: Number(price)
    }])

    if (error) {
      alert(error.message)
      console.log(error)
      return
    }

    router.push('/os')
  }

  useEffect(() => {
    carregar()
  }, [])

  return (
    <div className="p-8 max-w-md space-y-3">

      <h1 className="text-2xl mb-4">Nova Ordem</h1>

      <select
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded"
        value={deviceId}
        onChange={e => setDeviceId(e.target.value)}
      >
        <option value="">Aparelho</option>
        {aparelhos.map(d => (
          <option key={d.id} value={d.id}>
            {d.brand} {d.model}
          </option>
        ))}
      </select>

      <input
        placeholder="Problema relatado"
        value={reportedIssue}
        onChange={e => setReportedIssue(e.target.value)}
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <input
        placeholder="Diagnóstico"
        value={diagnosis}
        onChange={e => setDiagnosis(e.target.value)}
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <input
        placeholder="Serviço realizado"
        value={serviceDone}
        onChange={e => setServiceDone(e.target.value)}
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <input
        placeholder="Valor"
        value={price}
        onChange={e => setPrice(e.target.value)}
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <button
        onClick={salvar}
        className="w-full bg-green-600 p-3 rounded"
      >
        Salvar OS
      </button>

    </div>
  )
}