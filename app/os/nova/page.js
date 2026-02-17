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
  const [defeito, setDefeito] = useState('')
  const [valor, setValor] = useState('')

  async function carregar() {
    const { data: c } = await supabase.from('clients').select('*')
    const { data: d } = await supabase.from('devices').select('*')

    setClientes(c || [])
    setAparelhos(d || [])
  }

  async function salvar() {
    await supabase.from('service_orders').insert([{
      client_id: clientId,
      device_id: deviceId,
      defect: defeito,
      price: valor,
      status: 'Recebido'
    }])

    router.push('/os')
  }

  useEffect(() => {
    carregar()
  }, [])

  return (
    <div className="p-8 max-w-md">

      <h1 className="text-2xl mb-6">Nova Ordem</h1>

      <select
        className="w-full mb-3 p-3 bg-zinc-900 border border-zinc-800 rounded"
        value={clientId}
        onChange={e => setClientId(e.target.value)}
      >
        <option value="">Cliente</option>
        {clientes.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        className="w-full mb-3 p-3 bg-zinc-900 border border-zinc-800 rounded"
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
        placeholder="Defeito"
        value={defeito}
        onChange={e => setDefeito(e.target.value)}
        className="w-full mb-3 p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <input
        placeholder="Valor"
        value={valor}
        onChange={e => setValor(e.target.value)}
        className="w-full mb-6 p-3 bg-zinc-900 border border-zinc-800 rounded"
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