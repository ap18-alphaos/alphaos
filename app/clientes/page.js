'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'
import AuthGuard from '../../components/AuthGuard'

export default function Clientes() {
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    const { data } = await supabase.from('clientes').select('*')
    setClientes(data || [])
  }

  return (
    <AuthGuard>
      <Sidebar />

      <div className="ml-56 p-6 text-white">
        <h1 className="text-2xl mb-6">Clientes</h1>

        {clientes.map(c => (
          <div key={c.id} className="bg-zinc-800 p-4 rounded mb-4">
            <p>{c.nome}</p>
            <p>{c.telefone}</p>
            <p>{c.endereco}</p>
          </div>
        ))}
      </div>
    </AuthGuard>
  )
}