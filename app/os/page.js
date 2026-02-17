'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'
import AuthGuard from '../../components/AuthGuard'
import SignatureCanvas from 'react-signature-canvas'

export default function OrdemServico() {
  const sigRef = useRef()

  const [aparelhos, setAparelhos] = useState([])
  const [deviceId, setDeviceId] = useState('')
  const [defeito, setDefeito] = useState('')
  const [diagnostico, setDiagnostico] = useState('')
  const [servico, setServico] = useState('')
  const [status, setStatus] = useState('Recebido')
  const [valor, setValor] = useState('')
  const [pagamento, setPagamento] = useState('')
  const [garantia, setGarantia] = useState('')
  const [tecnico, setTecnico] = useState('')

  async function carregarAparelhos() {
    const { data } = await supabase.from('devices').select('id, brand, model')
    setAparelhos(data || [])
  }

  async function salvarOS(e) {
    e.preventDefault()

    const assinatura = sigRef.current.isEmpty()
      ? null
      : sigRef.current.getTrimmedCanvas().toDataURL('image/png')

    const { data, error } = await supabase
      .from('service_orders')
      .insert([
        {
          device_id: deviceId,
          reported_issue: defeito,
          diagnosis: diagnostico,
          service_done: servico,
          status,
          price: valor,
          payment_method: pagamento,
          warranty_days: garantia,
          technician: tecnico,
          signature: assinatura,
        },
      ])
      .select()
      .single()

    if (error) {
      alert(error.message)
      return
    }

    // registra entrada financeira
    await supabase.from('financial_entries').insert([
      {
        service_order_id: data.id,
        amount: valor,
        type: 'servico',
        description: `OS #${data.order_number}`,
      },
    ])

    sigRef.current.clear()
    setDefeito('')
    setDiagnostico('')
    setServico('')
    setValor('')
    setPagamento('')
    setGarantia('')
    setTecnico('')

    alert('OS criada e registrada no caixa')
  }

  useEffect(() => {
    carregarAparelhos()
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-950 text-white flex">

        <Sidebar />

        <div className="ml-48 p-6 w-full">

          <h1 className="text-2xl mb-6">Nova Ordem de Serviço</h1>

          <form onSubmit={salvarOS} className="space-y-3 max-w-md">

            <select className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}>

              <option value="">Selecione o aparelho</option>
              {aparelhos.map(a => (
                <option key={a.id} value={a.id}>
                  {a.brand} {a.model}
                </option>
              ))}
            </select>

            <textarea placeholder="Defeito" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={defeito} onChange={(e)=>setDefeito(e.target.value)} />
            <textarea placeholder="Diagnóstico" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={diagnostico} onChange={(e)=>setDiagnostico(e.target.value)} />
            <textarea placeholder="Serviço" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={servico} onChange={(e)=>setServico(e.target.value)} />

            <input placeholder="Valor" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={valor} onChange={(e)=>setValor(e.target.value)} />
            <input placeholder="Pagamento" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={pagamento} onChange={(e)=>setPagamento(e.target.value)} />
            <input placeholder="Garantia" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={garantia} onChange={(e)=>setGarantia(e.target.value)} />
            <input placeholder="Técnico" className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" value={tecnico} onChange={(e)=>setTecnico(e.target.value)} />

            <div>
              <p className="mb-2">Assinatura do Cliente</p>

              <SignatureCanvas
                ref={sigRef}
                penColor="white"
                canvasProps={{
                  width: 400,
                  height: 150,
                  className: 'bg-zinc-800 rounded'
                }}
              />

              <button
                type="button"
                onClick={() => sigRef.current.clear()}
                className="text-sm text-zinc-400 mt-1"
              >
                Limpar assinatura
              </button>
            </div>

            <button className="bg-white text-black w-full py-2 rounded">
              Criar OS
            </button>

          </form>

        </div>

      </div>
    </AuthGuard>
  )
}