"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function DetalheOS() {

  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [os, setOs] = useState<any>(null)
  const [clientes, setClientes] = useState<any[]>([])
  const [historico, setHistorico] = useState<any[]>([])
  const [msg, setMsg] = useState("")

  const [solucao, setSolucao] = useState("")
  const [peca, setPeca] = useState("")

  const [diagnosticoIA, setDiagnosticoIA] = useState<string | null>(null)
  const [baseTecnica, setBaseTecnica] = useState<any>(null)

  async function carregar() {

    const { data } = await supabase
      .from("ordens_servico")
      .select("*")
      .eq("id", id)
      .single()

    setOs(data)

    setSolucao(data?.solucao || "")
    setPeca(data?.peca_trocada || "")

    const { data: c } = await supabase
      .from("clientes")
      .select("*")
      .order("nome")

    if (c) setClientes(c)

    const { data: h } = await supabase
      .from("os_historico")
      .select("*")
      .eq("os_id", id)
      .order("criado_em", { ascending: false })

    if (h) setHistorico(h)

  }

  async function consultarBaseTecnica(modelo: string, defeito: string) {

    if (!modelo || !defeito) return

    const res = await fetch("/api/ia/base-defeitos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        modelo: modelo,
        defeito: defeito
      })
    })

    const data = await res.json()

    setBaseTecnica(data)

  }

  async function analisarIA() {

    if (!os?.modelo || !os?.defeito) return

    const res = await fetch("/api/ia/diagnostico-avancado", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        modelo: os.modelo,
        defeito: os.defeito
      })
    })

    const data = await res.json()

    setDiagnosticoIA(data.ia)

  }

  async function salvar() {

    const payload = {
      cliente_id: os.cliente_id,
      status: os.status,
      aparelho: os.aparelho,
      marca: os.marca,
      modelo: os.modelo,
      defeito: os.defeito,
      solucao: solucao,
      peca_trocada: peca
    }

    await supabase
      .from("ordens_servico")
      .update(payload)
      .eq("id", id)

    await supabase.from("os_historico").insert([
      {
        os_id: id,
        empresa_id: os.empresa_id,
        status: os.status
      }
    ])

    router.push("/os")

  }

  async function finalizar() {

    await supabase
      .from("ordens_servico")
      .update({
        status: "finalizada",
        solucao: solucao,
        peca_trocada: peca
      })
      .eq("id", id)

    await supabase.from("financeiro").insert([
      {
        valor: os.total,
        tipo: "entrada",
        empresa_id: os.empresa_id
      }
    ])

    await supabase.from("os_historico").insert([
      {
        os_id: id,
        empresa_id: os.empresa_id,
        status: "finalizada"
      }
    ])

    await supabase.from("base_defeitos").insert([
      {
        empresa_id: os.empresa_id,
        marca: os.marca,
        modelo: os.modelo,
        defeito: os.defeito,
        solucao: solucao,
        peca_trocada: peca
      }
    ])

    router.push("/os")

  }

  function enviarWhatsApp() {

    const cliente = clientes.find(c => c.id === os.cliente_id)

let telefone =
  os.telefone_cliente ||
  cliente?.telefone

if(!telefone){
  setMsg("Cliente não possui telefone")
  return
}

const numero = telefone.replace(/\D/g,"")

if (!telefone.startsWith("55")) {
  telefone = "55" + telefone
}

    const base = "https://unfixative-rafael-unflagged.ngrok-free.dev"

const link = `${base}/acompanhar/${os.codigo_publico}`

    const mensagem = `
Olá ${cliente.nome}!

Seu aparelho está em análise na Alpha Assistência.

Acompanhe o status do reparo aqui:
${link}
`

    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`

    window.open(url, "_blank")

  }

  useEffect(() => {
    carregar()
  }, [])

  useEffect(() => {

    if (os?.modelo && os?.defeito) {
      consultarBaseTecnica(os.modelo, os.defeito)
    }

  }, [os?.modelo, os?.defeito])

  if (!os) return <div>Carregando...</div>

  return (

  <div className="space-y-6 max-w-6xl">

    <div className="flex justify-between items-center">

      <h1 className="text-3xl font-bold">
        OS #{String(os.numero).padStart(4, "0")}
      </h1>

      <button
        onClick={() => router.back()}
        className="bg-zinc-800 px-4 py-2 rounded-xl"
      >
        Voltar
      </button>

    </div>

    <button
      onClick={enviarWhatsApp}
      className="bg-emerald-600 px-6 py-2.5 rounded-xl"
    >
      📲 Enviar Status ao Cliente
    </button>

    <div className="grid grid-cols-2 gap-4">

      <Card titulo="Cliente">

        <select
          value={os.cliente_id || ""}
          onChange={e => setOs({ ...os, cliente_id: e.target.value })}
          className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
        >

          <option value="">Selecione</option>

          {clientes.map(c => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}

        </select>

      </Card>

      <Card titulo="Status">

        <select
          value={os.status}
          onChange={e => setOs({ ...os, status: e.target.value })}
          className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
        >

          <option value="aberta">Aberta</option>
          <option value="em_diagnostico">Em Diagnóstico</option>
          <option value="aguardando_aprovacao">Aguardando Aprovação</option>
          <option value="aprovada">Aprovada</option>
          <option value="em_reparo">Em Reparo</option>
          <option value="finalizada">Finalizada</option>
          <option value="entregue">Entregue</option>
          <option value="cancelada">Cancelada</option>

        </select>

      </Card>

    </div>

    <Card titulo="Aparelho">

      <div className="grid grid-cols-3 gap-3">

        <input
          value={os.aparelho || ""}
          onChange={e => setOs({ ...os, aparelho: e.target.value })}
          placeholder="Aparelho"
          className="p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
        />

        <input
          value={os.marca || ""}
          onChange={e => setOs({ ...os, marca: e.target.value })}
          placeholder="Marca"
          className="p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
        />

        <input
          value={os.modelo || ""}
          onChange={e => setOs({ ...os, modelo: e.target.value })}
          placeholder="Modelo"
          className="p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
        />

      </div>

    </Card>

    <Card titulo="Defeito">

      <textarea
        value={os.defeito || ""}
        onChange={e => setOs({ ...os, defeito: e.target.value })}
        className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
      />

    </Card>

    <button
      onClick={analisarIA}
      className="bg-purple-600 px-6 py-2.5 rounded-xl"
    >
      ⚡ Analisar Diagnóstico Inteligente
    </button>

    {diagnosticoIA && (
      <Card titulo="🧠 Diagnóstico IA">
        <div className="text-sm whitespace-pre-line">
          {diagnosticoIA}
        </div>
      </Card>
    )}

    {baseTecnica && baseTecnica.casos > 0 && (
      <Card titulo="💡 Base Técnica Alpha">

        <div className="text-sm text-zinc-400">
          Casos registrados: {baseTecnica.casos}
        </div>

        <div className="space-y-2 mt-2">

          {baseTecnica.ranking.map((item:any,i:number)=>(
            <div key={i} className="text-sm">
              {i+1}. {item.solucao} ({item.total})
            </div>
          ))}

        </div>

      </Card>
    )}

    <Card titulo="Solução Aplicada">

      <input
        value={solucao}
        onChange={e => setSolucao(e.target.value)}
        placeholder="Ex: troca do módulo WiFi"
        className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
      />

      <input
        value={peca}
        onChange={e => setPeca(e.target.value)}
        placeholder="Peça trocada"
        className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
      />

    </Card>

    {/* TIMELINE HISTÓRICO */}

    <Card titulo="📜 Histórico da OS">

      <div className="space-y-4">

        {historico.length === 0 && (
          <p className="text-sm text-zinc-500">
            Nenhum histórico registrado
          </p>
        )}

        {historico.map((item:any,i:number)=>{

          const data=new Date(item.criado_em).toLocaleString("pt-BR")

          return(

            <div key={i} className="flex gap-4 items-start">

              <div className="flex flex-col items-center">

                <div className="w-3 h-3 bg-blue-500 rounded-full"/>

                {i !== historico.length-1 && (
                  <div className="w-[2px] h-10 bg-zinc-700"/>
                )}

              </div>

              <div>

                <p className="text-sm font-medium">
                  {item.status}
                </p>

                <p className="text-xs text-zinc-500">
                  {data}
                </p>

              </div>

            </div>

          )

        })}

      </div>

    </Card>

    <div className="flex gap-4">

      <button
        onClick={salvar}
        className="bg-blue-600 px-6 py-2.5 rounded-xl"
      >
        Salvar
      </button>

      <button
        onClick={finalizar}
        className="bg-green-600 px-6 py-2.5 rounded-xl"
      >
        Finalizar
      </button>

    </div>

  </div>

)

}

function Card({titulo,children}:any){

  return(

    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 p-4 rounded-xl space-y-3">

      <h2 className="text-base font-semibold text-zinc-200">
        {titulo}
      </h2>

      {children}

    </div>

  )

}