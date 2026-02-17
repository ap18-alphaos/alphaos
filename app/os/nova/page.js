'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovaOS() {
  const router = useRouter()

  const [clientes, setClientes] = useState([])
  const [aparelhos, setAparelhos] = useState([])

  const [clientId, setClientId] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [problema, setProblema] = useState('')
  const [valor, setValor] = useState('')
  const [servicoDono, setServicoDono] = useState('')

  async function carregar() {
    const { data: c } = await supabase.from('clients').select('*')
    const { data: d } = await supabase.from('devices').select('*')

    setClientes(c || [])
    setAparelhos(d || [])
  }

  async function salvar() {
    const { error } = await supabase.from('service_orders').insert([{
      device_id: deviceId,
      reported_issue: problema,
      diagnosis: problema,
      servico_dono: servicoDono,
      status: 'Recebido',
      price: Number(valor),
      payment_method: 'pix',
      warranty_days: 90
    }])

    if (error) {
      console.error(error)
      alert('Erro ao salvar OS')
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
        value={problema}
        onChange={e => setProblema(e.target.value)}
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <input
        placeholder="Valor"
        value={valor}
        onChange={e => setValor(e.target.value)}
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <input
        placeholder="Responsável pelo serviço"
        value={servicoDono}
        onChange={e => setServicoDono(e.target.value)}
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