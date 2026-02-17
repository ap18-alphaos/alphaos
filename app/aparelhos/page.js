'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'
import AuthGuard from '../../components/AuthGuard'

export default function Aparelhos() {
  const [clientes, setClientes] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [imei, setImei] = useState('')
  const [cor, setCor] = useState('')
  const [obs, setObs] = useState('')

  async function carregarClientes() {
    const { data } = await supabase.from('clients').select('*')
    setClientes(data || [])
  }

  async function salvarAparelho(e) {
    e.preventDefault()

    const { error } = await supabase.from('devices').insert([
      {
        client_id: clienteId,
        brand: marca,
        model: modelo,
        imei,
        color: cor,
        notes: obs,
      },
    ])

    if (error) alert(error.message)
    else {
      setMarca('')
      setModelo('')
      setImei('')
      setCor('')
      setObs('')
    }
  }

  useEffect(() => {
    carregarClientes()
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-950 text-white flex">

        <Sidebar />

        <div className="ml-48 p-6 w-full">

          <h1 className="text-2xl mb-6">Cadastrar Aparelho</h1>

          <form onSubmit={salvarAparelho} className="space-y-3 max-w-md">

            <select
              className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
            >
              <option value="">Selecione o cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input placeholder="Marca" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={marca} onChange={(e)=>setMarca(e.target.value)} />
            <input placeholder="Modelo" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={modelo} onChange={(e)=>setModelo(e.target.value)} />
            <input placeholder="IMEI" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={imei} onChange={(e)=>setImei(e.target.value)} />
            <input placeholder="Cor" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={cor} onChange={(e)=>setCor(e.target.value)} />
            <textarea placeholder="Observações" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={obs} onChange={(e)=>setObs(e.target.value)} />

            <button className="bg-white text-black w-full py-2 rounded">Salvar Aparelho</button>

          </form>

        </div>

      </div>
    </AuthGuard>
  )
}