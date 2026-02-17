'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'
import AuthGuard from '../../components/AuthGuard'
import { useRouter } from 'next/navigation'

export default function Clientes() {
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cpf, setCpf] = useState('')
  const [endereco, setEndereco] = useState('')
  const [clientes, setClientes] = useState([])

  async function carregarClientes() {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    setClientes(data || [])
  }

  async function salvarCliente(e) {
    e.preventDefault()

    const { error } = await supabase.from('clients').insert([
      {
        name: nome,
        phone: telefone,
        cpf,
        address: endereco,
      },
    ])

    if (!error) {
      setNome('')
      setTelefone('')
      setCpf('')
      setEndereco('')
      carregarClientes()
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

          <h1 className="text-2xl mb-6">Clientes</h1>

          <form onSubmit={salvarCliente} className="space-y-3 max-w-md">

            <input placeholder="Nome" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={nome} onChange={(e)=>setNome(e.target.value)} />
            <input placeholder="Telefone" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={telefone} onChange={(e)=>setTelefone(e.target.value)} />
            <input placeholder="CPF" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={cpf} onChange={(e)=>setCpf(e.target.value)} />
            <input placeholder="Endereço" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={endereco} onChange={(e)=>setEndereco(e.target.value)} />

            <button className="bg-white text-black w-full py-2 rounded">
              Salvar Cliente
            </button>

          </form>

          <div className="mt-10 space-y-2">

            {clientes.map(c => (
              <div
                key={c.id}
                onClick={() => router.push(`/clientes/${c.id}`)}
                className="bg-zinc-900 border border-zinc-800 p-3 rounded hover:bg-zinc-800 cursor-pointer"
              >
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-zinc-400">{c.phone}</p>
              </div>
            ))}

          </div>

        </div>

      </div>
    </AuthGuard>
  )
}