"use client"

import { useEffect, useState } from "react"
import { supabase, getUser } from "@/lib/supabase"
import {
  Wrench,
  Plus,
  Pencil,
  Trash2,
  Clock
} from "lucide-react"

type Servico = {
  id: string
  nome: string
  descricao: string
  valor: number
  tempo_estimado: number
}

export default function ServicosPage() {

  const [servicos, setServicos] = useState<Servico[]>([])
  const [empresaId, setEmpresaId] = useState<string | null>(null)

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [tempo, setTempo] = useState("")
  const [msg, setMsg] = useState("")

  const [editandoId, setEditandoId] = useState<string | null>(null)

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

  async function carregar(idEmpresa?:string){

    const empresa = idEmpresa || empresaId

    if(!empresa) return

    const {data} = await supabase
      .from("servicos")
      .select("*")
      .eq("empresa_id",empresa)
      .order("criado_em",{ascending:false})

    if(data) setServicos(data)

  }

  function limparCampos(){

    setNome("")
    setDescricao("")
    setValor("")
    setTempo("")
    setEditandoId(null)

  }

  async function salvar(){

    if(!empresaId) return

    if(editandoId){

      const {error} = await supabase
        .from("servicos")
        .update({
          nome,
          descricao,
          valor:Number(valor),
          tempo_estimado:Number(tempo)
        })
        .eq("id",editandoId)

      if(error){

        setMsg(error.message)

      }else{

        setMsg("Serviço atualizado")
        limparCampos()
        carregar()

      }

      return
    }

    const {error} = await supabase
      .from("servicos")
      .insert([
        {
          nome,
          descricao,
          valor:Number(valor),
          tempo_estimado:Number(tempo),
          empresa_id:empresaId
        }
      ])

    if(error){

      setMsg(error.message)

    }else{

      setMsg("Serviço cadastrado")
      limparCampos()
      carregar()

    }

  }

  function editar(s:Servico){

    setEditandoId(s.id)

    setNome(s.nome)
    setDescricao(s.descricao)
    setValor(String(s.valor))
    setTempo(String(s.tempo_estimado))

  }

  async function excluir(id:string){

    const confirmar = confirm("Excluir serviço?")

    if(!confirmar) return

    const {error} = await supabase
      .from("servicos")
      .delete()
      .eq("id",id)

    if(error){

      setMsg(error.message)

    }else{

      carregar()

    }

  }

  useEffect(()=>{
    carregarEmpresa()
  },[])

  return (

  <div className="space-y-10">

    {/* HEADER */}

    <div>

      <h1 className="text-3xl font-bold">
        Serviços
      </h1>

      <p className="text-zinc-400">
        Cadastre serviços técnicos realizados
      </p>

    </div>


    {/* FORM */}

    <div className="card-alpha space-y-4 max-w-2xl">

      <h2 className="flex items-center gap-2 font-semibold">

        <Plus size={18}/>

        {editandoId ? "Editar Serviço" : "Novo Serviço"}

      </h2>

      <input
        placeholder="Nome do serviço"
        value={nome}
        onChange={(e)=>setNome(e.target.value)}
        className="input"
      />

      <textarea
        placeholder="Descrição do serviço"
        value={descricao}
        onChange={(e)=>setDescricao(e.target.value)}
        className="input"
      />

      <div className="grid grid-cols-2 gap-4">

        <input
          placeholder="Valor"
          value={valor}
          onChange={(e)=>setValor(e.target.value)}
          className="input"
        />

        <input
          placeholder="Tempo estimado (min)"
          value={tempo}
          onChange={(e)=>setTempo(e.target.value)}
          className="input"
        />

      </div>

      <div className="flex gap-3">

        <button
          onClick={salvar}
          className="btn-primary"
        >
          {editandoId ? "Atualizar Serviço" : "Salvar Serviço"}
        </button>

        {editandoId && (

          <button
            onClick={limparCampos}
            className="btn"
          >
            Cancelar
          </button>

        )}

      </div>

      {msg && (
        <p className="text-sm text-zinc-400">
          {msg}
        </p>
      )}

    </div>


    {/* LISTA */}

    <div className="grid grid-cols-3 gap-6">

      {servicos.map((s)=>{

        return(

        <div
          key={s.id}
          className="card-alpha space-y-3"
        >

          <div className="flex items-center gap-2">

            <Wrench size={18}/>

            <p className="font-semibold">
              {s.nome}
            </p>

          </div>

          {s.descricao &&(

            <p className="text-sm text-zinc-400">
              {s.descricao}
            </p>

          )}

          <p>

            Valor:

            <span className="text-blue-400 ml-1">

              R$ {Number(s.valor).toFixed(2)}

            </span>

          </p>

          <p className="flex items-center gap-2 text-zinc-300">

            <Clock size={14}/>

            {s.tempo_estimado
              ? `${s.tempo_estimado} min`
              : "Tempo não definido"}

          </p>

          <div className="flex gap-2 pt-2">

            <button
              onClick={()=>editar(s)}
              className="btn"
            >
              <Pencil size={16}/>
            </button>

            <button
              onClick={()=>excluir(s.id)}
              className="btn-danger"
            >
              <Trash2 size={16}/>
            </button>

          </div>

        </div>

        )

      })}

    </div>

  </div>

)

}