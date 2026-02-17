'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovaOS() {
  const router = useRouter()

  const [aparelhos, setAparelhos] = useState([])

  const [deviceId, setDeviceId] = useState('')
  const [defeito, setDefeito] = useState('')
  const [valor, setValor] = useState('')
  const [tecnico, setTecnico] = useState('')

  async function carregar() {
    const { data } = await supabase.from('devices').select('*')
    setAparelhos(data || [])
  }

  async function salvar() {
    const { error } = await supabase.from('service_orders').insert([{
      device_id: deviceId,
      reported_issue: defeito,
      price: Number(valor),
      technician: tecnico,
      status: 'Recebido'
    }])

    if (error) {
      console.error(error)
      alert(error.message)
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
        placeholder="Defeito"
        value={defeito}
        onChange={e => setDefeito(e.target.value)}
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <input
        placeholder="Valor"
        value={valor}
        onChange={e => setValor(e.target.value)}
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <input
        placeholder="Técnico"
        value={tecnico}
        onChange={e => setTecnico(e.target.value)}
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