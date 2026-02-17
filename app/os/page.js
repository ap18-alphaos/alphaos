'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'
import AuthGuard from '../../components/AuthGuard'

export default function OS() {
  const [os, setOs] = useState([])

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    const { data } = await supabase
      .from('ordens_servico')
      .select('*')
      .order('numero', { ascending: false })

    setOs(data || [])
  }

  return (
    <AuthGuard>
      <Sidebar />

      <div className="ml-56 p-6 text-white">

        <h1 className="text-2xl mb-6">Ordens de Serviço</h1>

        {os.map(o => (
          <div key={o.id} className="bg-zinc-800 p-4 rounded mb-4">
            <p>OS #{o.numero}</p>
            <p>Status: {o.status}</p>
            <p>Valor: R$ {o.valor}</p>
          </div>
        ))}

      </div>
    </AuthGuard>
  )
}