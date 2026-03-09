"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, getUser } from "@/lib/supabase"
import { BrainCircuit } from "lucide-react"

export default function NovaOS() {

  const router = useRouter()

  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const [plano, setPlano] = useState<string>("free")

  const [clientes, setClientes] = useState<any[]>([])
  const [servicos, setServicos] = useState<any[]>([])

  const [clienteId, setClienteId] = useState("")
  const [servicoId, setServicoId] = useState("")
  const [valorServico, setValorServico] = useState(0)

  const [aparelho, setAparelho] = useState("")
  const [marca, setMarca] = useState("")
  const [modelo, setModelo] = useState("")
  const [imei, setImei] = useState("")
  const [defeito, setDefeito] = useState("")
  const [telefoneCliente, setTelefoneCliente] = useState("")

  const [textoIA, setTextoIA] = useState("")
  const [msg, setMsg] = useState("")
  const [bloqueado, setBloqueado] = useState(false)

  /* =========================
     ANALISAR IA
  ========================= */

  async function analisarIA() {

    if (!textoIA) return
    if (!empresaId) return

    try {

      const res = await fetch("/api/ia/diagnostico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ texto: textoIA })
      })

      const data = await res.json()

      if (!data?.sucesso) {
        console.error("Erro IA:", data)
        return
      }

      const r = data.resultado

      console.log("IA interpretada:", r)

      /* aparelho */

      if (r.aparelho) {

        setAparelho(r.aparelho)
        setModelo(r.aparelho)

        /* tentativa de detectar marca */

        if (r.aparelho.toLowerCase().includes("iphone")) {
          setMarca("Apple")
        }

        if (r.aparelho.toLowerCase().includes("samsung")) {
          setMarca("Samsung")
        }

      }

      /* defeito */

      if (r.problema) {
        setDefeito(r.problema)
      }

      /* =========================
         CLIENTE AUTOMÁTICO
      ========================= */

      if (r.cliente) {

        const nomeCliente = r.cliente.trim()

        const { data: existente } = await supabase
          .from("clientes")
          .select("*")
          .eq("empresa_id", empresaId)
          .eq("nome", nomeCliente)
          .limit(1)

        if (existente && existente.length > 0) {

          setClienteId(existente[0].id)

        } else {

          const { data: novoCliente, error } = await supabase
          .from("clientes")
          .insert([
            {
             nome: nomeCliente,
             empresa_id: empresaId
            }
          ])
           .select()
           .single()

          if (!error && novoCliente) {

            setClientes(prev => [...prev, novoCliente])
            setClienteId(novoCliente.id)

          }

        }

      }

    } catch (err) {

      console.error("Erro ao analisar IA:", err)

    }

  }

  /* =========================
     EMPRESA
  ========================= */

  async function carregarEmpresa() {

    const user = await getUser()
    if (!user) return

    const { data } = await supabase
      .from("empresas")
      .select("id, plano")
      .eq("user_id", user.id)
      .single()

    if (data) {
      setEmpresaId(data.id)
      setPlano(data.plano || "free")
      await verificarLimite(data.id, data.plano)
    }

  }

  async function verificarLimite(id: string, planoAtual: string) {

    if (planoAtual !== "free") return

    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0,0,0,0)

    const { count } = await supabase
      .from("ordens_servico")
      .select("*", { count:"exact", head:true })
      .eq("empresa_id", id)
      .gte("criado_em", inicioMes.toISOString())

    if ((count || 0) >= 30) {
      setBloqueado(true)
    }

  }

  /* =========================
     CARREGAR DADOS
  ========================= */

  async function carregarDados() {

    const { data:c } = await supabase.from("clientes").select("*")
    const { data:s } = await supabase.from("servicos").select("*")

    if (c) setClientes(c)
    if (s) setServicos(s)

  }

  /* =========================
     CRIAR OS
  ========================= */

  async function criarOS() {

    if (!empresaId) return

    if (!clienteId) {
      setMsg("Selecione um cliente")
      return
    }

    const codigoPublico =
  Math.random().toString(36).substring(2,8).toUpperCase()

const { error } = await supabase
  .from("ordens_servico")
  .insert([
    {
      empresa_id: empresaId,
      cliente_id: clienteId,
      servico_id: servicoId || null,
      total: valorServico,
      aparelho,
      marca,
      modelo,
      imei,
      defeito,
      telefone_cliente: telefoneCliente,
      codigo_publico: codigoPublico,
      status:"aberta"
    }
  ])

    if (error) {

      setMsg(error.message)

    } else {

      router.push("/os")

    }

  }

  useEffect(()=>{
    async function init(){
      await carregarEmpresa()
      await carregarDados()
    }
    init()
  },[])

  return (

    <div className="space-y-6 max-w-5xl">

      <h1 className="text-3xl font-bold">
        Nova Ordem de Serviço
      </h1>

      {/* IA */}

      <Card titulo="Criar OS com IA">

        <div className="flex items-center gap-2 text-purple-400">

          <BrainCircuit size={18} />

          <p className="text-sm">
            Descreva o atendimento rapidamente
          </p>

        </div>

        <textarea
          placeholder="Ex: João trouxe iPhone 11 que não carrega"
          value={textoIA}
          onChange={(e)=>setTextoIA(e.target.value)}
          className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
        />

        <button
          onClick={analisarIA}
          className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500"
        >
          ⚡ Analisar com IA
        </button>

      </Card>

      <Card titulo="Cliente">

        <select
          value={clienteId}
          onChange={(e)=>setClienteId(e.target.value)}
          className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
        >

          <option value="">Selecione o Cliente</option>

          {clientes.map((c)=>(
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}

        </select>

      </Card>

      <Card titulo="Telefone do Cliente">

           <input
              placeholder="WhatsApp do cliente"
              value={telefoneCliente}
              onChange={(e)=>setTelefoneCliente(e.target.value)}
              className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
            />

      </Card>

      <Card titulo="Aparelho">

        <div className="grid grid-cols-3 gap-3">

          <input
            placeholder="Aparelho"
            value={aparelho}
            onChange={(e)=>setAparelho(e.target.value)}
            className="p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
          />

          <input
            placeholder="Marca"
            value={marca}
            onChange={(e)=>setMarca(e.target.value)}
            className="p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
          />

          <input
            placeholder="Modelo"
            value={modelo}
            onChange={(e)=>setModelo(e.target.value)}
            className="p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
          />

        </div>

        <input
          placeholder="IMEI"
          value={imei}
          onChange={(e)=>setImei(e.target.value)}
          className="mt-3 w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
        />

      </Card>

      <Card titulo="Defeito Relatado">

        <textarea
          value={defeito}
          onChange={(e)=>setDefeito(e.target.value)}
          className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
          rows={4}
        />

      </Card>

      <button
        onClick={criarOS}
        className="bg-blue-600 px-6 py-2.5 rounded-xl hover:bg-blue-500"
      >
        Criar OS
      </button>

      {msg && <p className="text-red-400">{msg}</p>}

    </div>

  )

}

function Card({ titulo, children }: any) {

  return (

    <div className="
      bg-gradient-to-br
      from-zinc-900
      to-zinc-800
      border border-zinc-700
      p-4
      rounded-xl
      space-y-3
    ">

      <h2 className="text-base font-semibold">
        {titulo}
      </h2>

      {children}

    </div>

  )

}