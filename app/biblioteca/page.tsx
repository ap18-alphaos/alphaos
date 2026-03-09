"use client"

import { useEffect, useState } from "react"
import { supabase, getUser } from "@/lib/supabase"
import {
  BookOpen,
  Search,
  Cpu,
  Wrench,
  AlertTriangle
} from "lucide-react"

type Caso = {
  id:string
  marca:string
  modelo:string
  defeito:string
  solucao:string
  peca_trocada:string
}

export default function BibliotecaTecnica(){

  const [empresaId,setEmpresaId] = useState<string | null>(null)

  const [casos,setCasos] = useState<Caso[]>([])

  const [busca,setBusca] = useState("")

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
      .from("base_defeitos")
      .select("*")
      .eq("empresa_id",id)
      .order("criado_em",{ascending:false})

    if(data) setCasos(data)

  }

  useEffect(()=>{
    carregarEmpresa()
  },[])

  const filtrados = casos.filter(c=>

    c.modelo?.toLowerCase().includes(busca.toLowerCase()) ||

    c.defeito?.toLowerCase().includes(busca.toLowerCase()) ||

    c.solucao?.toLowerCase().includes(busca.toLowerCase())

  )

  const modelos =
    [...new Set(casos.map(c=>c.modelo))]

  const marcas =
    [...new Set(casos.map(c=>c.marca))]

  return(

  <div className="space-y-10">

    {/* HEADER */}

    <div>

      <h1 className="text-3xl font-bold flex items-center gap-2">

        <BookOpen size={24}/>

        Biblioteca Técnica

      </h1>

      <p className="text-zinc-400">
        Base de conhecimento dos reparos realizados
      </p>

    </div>


    {/* MÉTRICAS */}

    <div className="grid grid-cols-4 gap-6">

      <Metric titulo="Casos registrados"
        valor={casos.length}
      />

      <Metric titulo="Modelos"
        valor={modelos.length}
      />

      <Metric titulo="Marcas"
        valor={marcas.length}
      />

      <Metric titulo="Soluções"
        valor={[...new Set(casos.map(c=>c.solucao))].length}
      />

    </div>


    {/* BUSCA */}

    <div className="search">

      <Search size={18}/>

      <input
        placeholder="Buscar defeito, modelo ou solução..."
        value={busca}
        onChange={e=>setBusca(e.target.value)}
      />

    </div>


    {/* LISTA */}

    <div className="grid grid-cols-3 gap-6">

      {filtrados.map(caso=>(

        <div
          key={caso.id}
          className="card-alpha space-y-3"
        >

          <div className="flex items-center gap-2">

            <Cpu size={16}/>

            <p className="font-semibold">

              {caso.modelo}

            </p>

          </div>

          <p className="text-sm text-zinc-400">

            {caso.marca}

          </p>

          <p className="flex items-start gap-2">

            <AlertTriangle size={16}/>

            {caso.defeito}

          </p>

          <p className="flex items-start gap-2 text-green-400">

            <Wrench size={16}/>

            {caso.solucao}

          </p>

          {caso.peca_trocada &&(

            <p className="text-sm text-blue-400">

              Peça: {caso.peca_trocada}

            </p>

          )}

        </div>

      ))}

    </div>

  </div>

)

}

function Metric({titulo,valor}:any){

  return(

    <div className="metric">

      <p className="text-zinc-400 text-sm">
        {titulo}
      </p>

      <p className="metric-value mt-1">
        {valor}
      </p>

    </div>

  )

}