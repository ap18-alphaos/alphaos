"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AcompanharOS(){

  const params = useParams()
  const codigo = params.codigo as string

  const [os,setOs] = useState<any>(null)
  const [historico,setHistorico] = useState<any[]>([])
  const [processando,setProcessando] = useState(false)

  async function carregar(){

    const {data,error} = await supabase
      .from("ordens_servico")
      .select("*")
      .eq("codigo_publico",codigo)
      .single()

    if(error){
      console.log(error)
      return
    }

    if(!data) return

    setOs(data)

    const {data:h} = await supabase
      .from("os_historico")
      .select("*")
      .eq("os_id",data.id)
      .order("criado_em",{ascending:true})

    if(h) setHistorico(h)

  }

  async function aprovar(acao:string){

    setProcessando(true)

    await fetch("/api/os/aprovacao",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        codigo,
        acao
      })
    })

    location.reload()

  }

  useEffect(()=>{
    if(codigo){
      carregar()
    }
  },[codigo])

  if(!os) return(

    <div className="min-h-screen flex items-center justify-center text-zinc-400 bg-zinc-950">
      OS não encontrada
    </div>

  )

  return(

  <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex items-center justify-center px-4 py-10">

    <div className="w-full max-w-md space-y-8">

      {/* HEADER */}

      <div className="text-center space-y-1">

        <h1 className="text-3xl font-bold text-white tracking-tight">
          Alpha Assistência
        </h1>

        <p className="text-zinc-400 text-sm">
          Acompanhamento do Reparo
        </p>

      </div>

      {/* CARD APARELHO */}

      <div className="
        bg-gradient-to-br
        from-zinc-900
        to-zinc-800
        border border-zinc-800
        rounded-2xl
        p-6
        space-y-5
        shadow-lg
      ">

        <div>

          <p className="text-xs text-zinc-500 uppercase tracking-wide">
            Aparelho
          </p>

          <p className="text-lg font-semibold text-white">
            {os.modelo}
          </p>

        </div>

        <div>

          <p className="text-xs text-zinc-500 uppercase tracking-wide">
            Defeito
          </p>

          <p className="text-white">
            {os.defeito}
          </p>

        </div>

        <div>

          <p className="text-xs text-zinc-500 uppercase tracking-wide">
            Status Atual
          </p>

          <p className="text-xl font-bold text-blue-400">
            {os.status}
          </p>

        </div>

      </div>

      {/* ORÇAMENTO */}

      {os.status === "aguardando_aprovacao" && (

        <div className="
          bg-gradient-to-br
          from-zinc-900
          to-zinc-800
          border border-zinc-800
          p-6
          rounded-2xl
          space-y-5
        ">

          <p className="text-sm text-zinc-400 text-center">
            Orçamento do reparo
          </p>

          <p className="text-4xl font-bold text-emerald-400 text-center">
            R$ {Number(os.total || 0).toFixed(2)}
          </p>

          <div className="flex flex-col gap-3">

            <button
              onClick={()=>aprovar("aprovar")}
              disabled={processando}
              className="
                w-full
                bg-green-600
                py-3
                rounded-xl
                font-medium
                hover:bg-green-500
                transition
              "
            >
              Aprovar Reparo
            </button>

            <button
              onClick={()=>aprovar("recusar")}
              disabled={processando}
              className="
                w-full
                bg-red-600
                py-3
                rounded-xl
                font-medium
                hover:bg-red-500
                transition
              "
            >
              Recusar
            </button>

          </div>

        </div>

      )}

      {/* HISTÓRICO */}

      <div className="
        bg-gradient-to-br
        from-zinc-900
        to-zinc-800
        border border-zinc-800
        p-6
        rounded-2xl
      ">

        <h2 className="font-semibold text-white mb-5">
          Histórico do Reparo
        </h2>

        <div className="space-y-4">

          {historico.map((item:any,i:number)=>{

            const data = new Date(item.criado_em).toLocaleString("pt-BR")

            return(

              <div key={i} className="flex items-start gap-3">

                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"/>

                <div className="flex-1 text-sm">

                  <p className="text-white">
                    {item.status}
                  </p>

                  <p className="text-zinc-500 text-xs">
                    {data}
                  </p>

                </div>

              </div>

            )

          })}

        </div>

      </div>

    </div>

  </div>

)

}