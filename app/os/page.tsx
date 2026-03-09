"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase, getUser } from "@/lib/supabase"
import { BrainCircuit } from "lucide-react"

type OS = {
  id: string
  numero: number
  status: string
  total: number
  criado_em: string
  clientes: { nome: string }
}

export default function ListaOS() {

  const [empresaId,setEmpresaId] = useState<string | null>(null)
  const [lista,setLista] = useState<OS[]>([])
  const [diagnostico,setDiagnostico] = useState("")
  const [resultadoIA,setResultadoIA] = useState<any>(null)

  async function carregarEmpresa(){

    const user = await getUser()

    if(!user) return

    const {data} = await supabase
      .from("empresas")
      .select("id")
      .eq("user_id",user.id)
      .single()

    if(data) setEmpresaId(data.id)

  }

  async function carregarDados(id:string){

    const {data} = await supabase
      .from("ordens_servico")
      .select(`
        *,
        clientes(nome)
      `)
      .eq("empresa_id",id)
      .order("criado_em",{ascending:false})

    if(data) setLista(data as any)

  }

  useEffect(()=>{

    carregarEmpresa()

  },[])

  useEffect(()=>{

    if(empresaId) carregarDados(empresaId)

  },[empresaId])

  async function gerarDiagnostico(){

    if(!diagnostico) return

    const res = await fetch("/api/ia/diagnostico",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        texto:diagnostico
      })
    })

    const data = await res.json()

    setResultadoIA(data.resultado)

  }

  return(

  <div className="space-y-10">

    {/* HEADER */}

    <div className="flex justify-between items-center">

      <div>

        <h1 className="text-3xl font-bold">
          Ordens de Serviço
        </h1>

        <p className="text-zinc-400">
          Gerencie todo o fluxo técnico
        </p>

      </div>

      <Link
        href="/os/nova"
        className="
        bg-blue-600
        px-6
        py-3
        rounded-xl
        transition-all
        hover:bg-blue-500
        hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]
        hover:-translate-y-1
        "
      >
        + Nova OS
      </Link>

    </div>

    {/* CARD IA */}

    <div className="
    bg-gradient-to-br
    from-blue-900/30
    to-zinc-900
    border border-blue-500/30
    p-6
    rounded-2xl
    shadow-[0_0_30px_rgba(59,130,246,0.15)]
    ">

      <div className="flex items-center gap-3 mb-4">

        <BrainCircuit className="text-blue-400"/>

        <div>

          <h2 className="font-semibold text-lg">
            Diagnóstico Inteligente
          </h2>

          <p className="text-zinc-400 text-sm">
            Descreva o sintoma técnico do aparelho
          </p>

        </div>

      </div>

      <div className="flex gap-3">

        <input
          value={diagnostico}
          onChange={(e)=>setDiagnostico(e.target.value)}
          placeholder="Ex: iPhone 11 sem WiFi após queda"
          className="
          flex-1
          bg-zinc-900
          border border-zinc-700
          rounded-xl
          px-4 py-3
          focus:outline-none
          focus:border-blue-500
          "
        />

        <button
          onClick={gerarDiagnostico}
          className="
          bg-blue-600
          px-6
          rounded-xl
          hover:bg-blue-500
          transition-all
          hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]
          "
        >
          Analisar
        </button>

      </div>

      {resultadoIA && (

        <div className="mt-6 p-4 bg-zinc-900 border border-zinc-700 rounded-xl">

          <p className="text-sm text-zinc-400 mb-2">
            Resultado IA
          </p>

          <pre className="text-sm">
            {JSON.stringify(resultadoIA,null,2)}
          </pre>

        </div>

      )}

    </div>

    {/* LISTA */}

    <div className="space-y-4">

      {lista.length === 0 &&(

        <div className="text-zinc-400">
          Nenhuma OS cadastrada.
        </div>

      )}

      {lista.map(os=>{

        const data = new Date(os.criado_em).toLocaleDateString("pt-BR")

        return(

        <Link
          key={os.id}
          href={`/os/${os.id}`}
          className="
          block
          bg-gradient-to-br
          from-zinc-900
          to-zinc-800
          border border-zinc-700
          p-6
          rounded-2xl
          transition-all
          duration-300
          hover:border-blue-500
          hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]
          hover:-translate-y-1
          "
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="font-semibold text-lg">
                OS #{String(os.numero).padStart(4,"0")}
              </p>

              <p className="text-zinc-400 text-sm">
                {os.clientes?.nome}
              </p>

              <p className="text-xs text-zinc-500 mt-1">
                {data}
              </p>

            </div>

            <div className="text-right space-y-1">

              <StatusBadge status={os.status}/>

              <p className="text-blue-400 font-semibold">
                R$ {Number(os.total || 0).toFixed(2)}
              </p>

            </div>

          </div>

        </Link>

        )

      })}

    </div>

  </div>

)

}

function StatusBadge({status}:{status:string}){

  const cores:any={

    aberta:"bg-yellow-500/20 text-yellow-400 border-yellow-500",
    em_diagnostico:"bg-blue-500/20 text-blue-400 border-blue-500",
    aguardando_aprovacao:"bg-orange-500/20 text-orange-400 border-orange-500",
    aprovada:"bg-purple-500/20 text-purple-400 border-purple-500",
    em_reparo:"bg-indigo-500/20 text-indigo-400 border-indigo-500",
    finalizada:"bg-green-500/20 text-green-400 border-green-500",
    entregue:"bg-emerald-500/20 text-emerald-400 border-emerald-500",
    cancelada:"bg-red-500/20 text-red-400 border-red-500"

  }

  const texto=status.replaceAll("_"," ")

  return(

    <span className={`px-3 py-1 text-xs rounded-full border ${cores[status] || "bg-zinc-700"}`}>

      {texto}

    </span>

  )

}