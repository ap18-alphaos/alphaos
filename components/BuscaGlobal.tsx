"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function BuscaGlobal() {

  const [termo,setTermo] = useState("")
  const [resultados,setResultados] = useState<any>(null)
  const router = useRouter()

  async function buscar(valor:string){

    setTermo(valor)

    if(valor.length < 2){
      setResultados(null)
      return
    }

    const res = await fetch("/api/busca",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({termo:valor})
    })

    const data = await res.json()

    setResultados(data)

  }

  return(

  <div className="relative w-96">

    <input
      value={termo}
      onChange={e=>buscar(e.target.value)}
      placeholder="Buscar cliente, aparelho, produto..."
      className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
    />

    {resultados && (

      <div className="absolute mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-50">

        {resultados.clientes?.map((c:any)=>(
          <div
            key={c.id}
            onClick={()=>router.push(`/clientes`)}
            className="p-2 hover:bg-zinc-800 cursor-pointer"
          >
            👤 {c.nome}
          </div>
        ))}

        {resultados.os?.map((o:any)=>(
          <div
            key={o.id}
            onClick={()=>router.push(`/os/${o.id}`)}
            className="p-2 hover:bg-zinc-800 cursor-pointer"
          >
            🔧 OS #{o.numero} — {o.modelo}
          </div>
        ))}

        {resultados.produtos?.map((p:any)=>(
          <div
            key={p.id}
            onClick={()=>router.push(`/produtos`)}
            className="p-2 hover:bg-zinc-800 cursor-pointer"
          >
            📦 {p.nome}
          </div>
        ))}

      </div>

    )}

  </div>

)

}