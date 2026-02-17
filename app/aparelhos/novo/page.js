'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovoAparelho() {
  const router = useRouter()

  const [clientes, setClientes] = useState([])
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [imei, setImei] = useState('')
  const [clientId, setClientId] = useState('')

  async function carregar() {
    const { data } = await supabase.from('clients').select('*')
    setClientes(data || [])
  }

  async function salvar() {
    await supabase.from('devices').insert([{
      brand,
      model,
      imei,
      client_id: clientId
    }])

    router.push('/aparelhos')
  }

  useEffect(() => {
    carregar()
  }, [])

  return (
    <div className="p-8 max-w-md">

      <h1 className="text-2xl mb-6">Novo Aparelho</h1>

      <input
        placeholder="Marca"
        value={brand}
        onChange={e => setBrand(e.target.value)}
        className="w-full mb-3 p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <input
        placeholder="Modelo"
        value={model}
        onChange={e => setModel(e.target.value)}
        className="w-full mb-3 p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <input
        placeholder="IMEI"
        value={imei}
        onChange={e => setImei(e.target.value)}
        className="w-full mb-3 p-3 bg-zinc-900 border border-zinc-800 rounded"
      />

      <select
        className="w-full mb-6 p-3 bg-zinc-900 border border-zinc-800 rounded"
        value={clientId}
        onChange={e => setClientId(e.target.value)}
      >
        <option value="">Cliente</option>
        {clientes.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <button
        onClick={salvar}
        className="w-full bg-green-600 p-3 rounded"
      >
        Salvar Aparelho
      </button>

    </div>
  )
}