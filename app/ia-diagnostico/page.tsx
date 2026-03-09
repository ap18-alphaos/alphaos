"use client"

import { useState } from "react"

export default function IADiagnostico() {

  const [modelo,setModelo] = useState("")
  const [defeito,setDefeito] = useState("")
  const [resultado,setResultado] = useState<string | null>(null)
  const [loading,setLoading] = useState(false)

  async function analisar(){

    if(!modelo || !defeito) return

    setLoading(true)

    const res = await fetch("/api/ia/diagnostico-avancado",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        modelo,
        defeito
      })
    })

    const data = await res.json()

    setResultado(data.ia)

    setLoading(false)

  }

  return(

  <div className="space-y-8 max-w-4xl">

    <div>

      <h1 className="text-3xl font-bold">
        Diagnóstico Inteligente
      </h1>

      <p className="text-zinc-400 mt-1">
        Assistente técnico baseado em IA
      </p>

    </div>

    <div className="grid grid-cols-2 gap-4">

      <input
        value={modelo}
        onChange={(e)=>setModelo(e.target.value)}
        placeholder="Modelo (ex: iPhone 11)"
        className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl"
      />

      <input
        value={defeito}
        onChange={(e)=>setDefeito(e.target.value)}
        placeholder="Defeito (ex: não liga)"
        className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl"
      />

    </div>

    <button
      onClick={analisar}
      className="
        bg-purple-600
        px-6
        py-3
        rounded-xl
        hover:shadow-[0_0_20px_rgba(168,85,247,0.7)]
        transition
      "
    >

      {loading ? "Analisando..." : "⚡ Analisar com IA"}

    </button>

    {resultado &&(

      <div className="
        bg-gradient-to-br
        from-zinc-900
        to-zinc-800
        border
        border-zinc-700
        p-6
        rounded-xl
      ">

        <h2 className="font-semibold mb-3">
          Diagnóstico
        </h2>

        <div className="text-sm whitespace-pre-line text-zinc-300">

          {resultado}

        </div>

      </div>

    )}

  </div>

)

}