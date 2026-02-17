'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'
import AuthGuard from '../../components/AuthGuard'

export default function Aparelhos() {
  const [aparelhos, setAparelhos] = useState([])

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    const { data } = await supabase.from('aparelhos').select('*')
    setAparelhos(data || [])
  }

  return (
    <AuthGuard>
      <Sidebar />

      <div className="ml-56 p-6 text-white">

        <h1 className="text-2xl mb-6">Aparelhos</h1>

        {aparelhos.map(a => (
          <div key={a.id} className="bg-zinc-800 p-4 rounded mb-4">
            <p><b>Marca:</b> {a.marca}</p>
            <p><b>Modelo:</b> {a.modelo}</p>
            <p><b>IMEI:</b> {a.imei}</p>
          </div>
        ))}

      </div>
    </AuthGuard>
  )
}