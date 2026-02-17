'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import jsPDF from 'jspdf'
import Sidebar from '../../components/Sidebar'
import AuthGuard from '../../components/AuthGuard'

export default function Dashboard() {
  const [os, setOs] = useState([])

  async function carregarOS() {
    const { data } = await supabase
      .from('service_orders')
      .select(`
        id,
        order_number,
        status,
        price,
        technician,
        reported_issue,
        signature,
        devices (
          brand,
          model,
          clients (
            name,
            phone
          )
        )
      `)
      .order('order_number', { ascending: false })

    setOs(data || [])
  }

  function gerarPDF(o) {
    const doc = new jsPDF()

    doc.text(`ORDEM DE SERVIÇO #${String(o.order_number).padStart(6,'0')}`, 20, 20)
    doc.text(`Cliente: ${o.devices?.clients?.name}`, 20, 35)
    doc.text(`Aparelho: ${o.devices?.brand} ${o.devices?.model}`, 20, 45)
    doc.text(`Defeito: ${o.reported_issue}`, 20, 55)
    doc.text(`Status: ${o.status}`, 20, 65)
    doc.text(`Valor: R$ ${o.price}`, 20, 75)
    doc.text(`Técnico: ${o.technician}`, 20, 85)

    if (o.signature) {
      doc.text('Assinatura do Cliente:', 20, 100)
      doc.addImage(o.signature, 'PNG', 20, 105, 120, 40)
    }

    doc.save(`OS-${o.order_number}.pdf`)
  }

  function enviarWhats(o) {
    const texto =
`Olá ${o.devices?.clients?.name}!

Sua Ordem de Serviço:

OS #${String(o.order_number).padStart(6,'0')}
Aparelho: ${o.devices?.brand} ${o.devices?.model}
Status: ${o.status}
Valor: R$ ${o.price}

ALPHA Assistência`

    const numero = o.devices?.clients?.phone?.replace(/\D/g, '')

    window.open(`https://wa.me/55${numero}?text=${encodeURIComponent(texto)}`)
  }

  useEffect(() => {
    carregarOS()
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-950 text-white flex">

        <Sidebar />

        <div className="ml-48 p-6 w-full">

          <h1 className="text-2xl mb-6">Ordens de Serviço</h1>

          <div className="space-y-3">

            {os.map((o) => (
              <div key={o.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded">

                <p className="font-semibold">
                  OS #{String(o.order_number).padStart(6,'0')}
                </p>

                <p>{o.devices?.brand} {o.devices?.model}</p>

                <p className="text-sm text-zinc-400">
                  Cliente: {o.devices?.clients?.name}
                </p>

                <p className="text-sm text-zinc-400">Status: {o.status}</p>
                <p className="text-sm text-zinc-400">Valor: R$ {o.price}</p>

                <div className="flex gap-2 mt-3">

                  <button
                    onClick={() => gerarPDF(o)}
                    className="bg-white text-black px-4 py-2 rounded"
                  >
                    PDF
                  </button>

                  <button
                    onClick={() => enviarWhats(o)}
                    className="bg-green-600 px-4 py-2 rounded"
                  >
                    WhatsApp
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </AuthGuard>
  )
}