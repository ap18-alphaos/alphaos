"use client"

import { useEffect, useState } from "react"
import { supabase, getUser } from "@/lib/supabase"

type Lancamento = {
  id:string
  valor:number
  criado_em:string
}

export default function Financeiro(){

  const [dados,setDados] = useState<Lancamento[]>([])
  const [total,setTotal] = useState(0)
  const [empresaId,setEmpresaId] = useState<string | null>(null)

  async function carregarEmpresa(){

    const user = await getUser()

    if(!user) return

    const {data} = await supabase
      .from("empresas")
      .select("id")
      .eq("user_id",user.id)
      .single()

    if(data){
      setEmpresaId(data.id)
      carregar(data.id)
    }

  }

  async function carregar(id:string){

    const {data} = await supabase
      .from("financeiro")
      .select("*")
      .eq("empresa_id",id)
      .order("criado_em",{ascending:false})

    if(!data) return

    setDados(data)

    const soma = data.reduce((acc,i)=>acc+Number(i.valor),0)

    setTotal(soma)

  }

  useEffect(()=>{
    carregarEmpresa()
  },[])

  return(

  <div className="space-y-6">

    <h1 className="text-2xl font-bold">
      Financeiro
    </h1>

    <div className="bg-zinc-800 border border-zinc-700 rounded p-4 text-xl">

      Total faturado: <strong>R$ {total.toFixed(2)}</strong>

    </div>

    <table className="w-full border border-zinc-800">

      <thead className="bg-zinc-800">

        <tr>
          <th className="p-2 text-left">Data</th>
          <th className="p-2 text-left">Valor</th>
        </tr>

      </thead>

      <tbody>

        {dados.map(f=>(
          <tr key={f.id} className="border-t border-zinc-800">

            <td className="p-2">
              {new Date(f.criado_em).toLocaleString()}
            </td>

            <td className="p-2">
              R$ {Number(f.valor).toFixed(2)}
            </td>

          </tr>
        ))}

      </tbody>

    </table>

  </div>

)

}