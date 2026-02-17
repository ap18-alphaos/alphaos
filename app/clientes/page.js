'use client'

import Sidebar from '../../components/Sidebar'

export default function Clientes() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-48 p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Clientes</h1>

        <p>Página de clientes funcionando.</p>
      </div>
    </div>
  )
}