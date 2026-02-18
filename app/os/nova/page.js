'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovaOS() {
  const router = useRouter()

  const [aparelhos, setAparelhos] = useState([])

  const [deviceId, setDeviceId] = useState('')
  const [problema, setProblema] = useState('')
  const [diagnostico, setDiagnostico] = useState('')
  const [servico, setServico] = useState('')
  const [valor, setValor] = useState('')

  async function carregar() {
    const { data } = await supabase.from('devices').select('*')
    setAparelhos(data || [])
  }

  async function salvar() {
    const { error } = await supabase.from('service_orders').insert([{
      device_id: deviceId,
      reported_issue: problema,
      diagnosis: diagnostico,
      service_done: servico,
      price: Number(valor),
      status: 'Recebido',
      payment_method: 'pix',
      warranty_days: 90
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
        <option value="">Selecione aparelho</option>

        {aparelhos.map(d => (
          <option key={d.id} value={d.id}>
            {d.brand} {d.model}
          </option>
        ))}
      </select>

      <input
        placeholder="Problema informado"
        value={problema}
        onChange={e => setProblema(e.target.value)}
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <input
        placeholder="Diagnóstico"
        value={diagnostico}
        onChange={e => setDiagnostico(e.target.value)}
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <input
        placeholder="Serviço realizado"
        value={servico}
        onChange={e => setServico(e.target.value)}
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <input
        placeholder="Valor"
        value={valor}
        onChange={e => setValor(e.target.value)}
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
