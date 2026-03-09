"use client"

import { useEffect, useState } from "react"
import { supabase, getUser } from "@/lib/supabase"
import {
  User,
  Phone,
  Mail,
  Plus,
  Search,
  Pencil,
  Trash2,
  MessageCircle
} from "lucide-react"

type Cliente = {
  id: string
  nome: string
  telefone: string
  email: string
}

export default function ClientesPage() {

  const [clientes,setClientes] = useState<Cliente[]>([])
  const [empresaId,setEmpresaId] = useState<string | null>(null)

  const [nome,setNome] = useState("")
  const [telefone,setTelefone] = useState("")
  const [email,setEmail] = useState("")

  const [editandoId,setEditandoId] = useState<string | null>(null)

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
      carregarClientes(data.id)
    }

  }

  async function carregarClientes(id:string){

    const {data} = await supabase
      .from("clientes")
      .select("*")
      .eq("empresa_id",id)
      .order("nome")

    if(data) setClientes(data)

  }

  async function salvar(){

    if(!empresaId) return

    if(editandoId){

      await supabase
        .from("clientes")
        .update({
          nome,
          telefone,
          email
        })
        .eq("id",editandoId)

      setEditandoId(null)

    }else{

      await supabase
        .from("clientes")
        .insert([{
          nome,
          telefone,
          email,
          empresa_id:empresaId
        }])

    }

    setNome("")
    setTelefone("")
    setEmail("")

    carregarClientes(empresaId)

  }

  function editar(cliente:Cliente){

    setEditandoId(cliente.id)

    setNome(cliente.nome)
    setTelefone(cliente.telefone || "")
    setEmail(cliente.email || "")

  }

  function cancelarEdicao(){

    setEditandoId(null)

    setNome("")
    setTelefone("")
    setEmail("")

  }

  async function excluir(id:string){

    if(!confirm("Excluir cliente?")) return

    await supabase
      .from("clientes")
      .delete()
      .eq("id",id)

    if(empresaId) carregarClientes(empresaId)

  }

  useEffect(()=>{
    carregarEmpresa()
  },[])

  const filtrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return(

  <div className="space-y-10">

    <div>

      <h1 className="text-3xl font-bold">
        Clientes
      </h1>

      <p className="text-zinc-400">
        Gerencie seus clientes e histórico técnico
      </p>

    </div>

    <div className="grid grid-cols-4 gap-6">

      <Metric titulo="Total Clientes" valor={clientes.length} />

      <Metric titulo="Com Telefone"
        valor={clientes.filter(c=>c.telefone).length}
      />

      <Metric titulo="Com Email"
        valor={clientes.filter(c=>c.email).length}
      />

      <Metric titulo="Novos"
        valor={clientes.slice(0,5).length}
      />

    </div>

    <div className="flex gap-4">

      <div className="
        flex items-center gap-2
        bg-zinc-900
        border border-zinc-700
        rounded-xl
        px-4
        flex-1
      ">

        <Search size={18}/>

        <input
          placeholder="Buscar cliente..."
          value={busca}
          onChange={e=>setBusca(e.target.value)}
          className="
            bg-transparent
            outline-none
            py-3
            w-full
          "
        />

      </div>

    </div>

    <div className="
      bg-gradient-to-br
      from-zinc-900
      to-zinc-800
      border border-zinc-700
      p-6
      rounded-2xl
      space-y-4
    ">

      <h2 className="font-semibold flex items-center gap-2">
        <Plus size={18}/>
        {editandoId ? "Editar Cliente" : "Novo Cliente"}
      </h2>

      <div className="grid grid-cols-3 gap-4">

        <input
          placeholder="Nome"
          value={nome}
          onChange={e=>setNome(e.target.value)}
          className="input"
        />

        <input
          placeholder="Telefone"
          value={telefone}
          onChange={e=>setTelefone(e.target.value)}
          className="input"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          className="input"
        />

      </div>

      <div className="flex gap-3">

        <button
          onClick={salvar}
          className="
            bg-blue-600
            px-6
            py-2.5
            rounded-xl
            hover:bg-blue-500
          "
        >
          {editandoId ? "Atualizar Cliente" : "Salvar Cliente"}
        </button>

        {editandoId && (
          <button
            onClick={cancelarEdicao}
            className="bg-zinc-700 px-6 py-2.5 rounded-xl"
          >
            Cancelar
          </button>
        )}

      </div>

    </div>

    <div className="grid grid-cols-3 gap-6">

      {filtrados.map(cliente=>(

        <div
          key={cliente.id}
          className="
            bg-gradient-to-br
            from-zinc-900
            to-zinc-800
            border border-zinc-700
            p-5
            rounded-2xl
            hover:border-blue-500
            hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]
            transition
          "
        >

          <div className="flex items-center gap-3 mb-3">

            <div className="
              w-10 h-10
              bg-blue-600
              rounded-full
              flex items-center justify-center
            ">

              <User size={18}/>

            </div>

            <div>

              <p className="font-semibold">
                {cliente.nome}
              </p>

            </div>

          </div>

          <div className="space-y-1 text-sm text-zinc-400">

            {cliente.telefone &&(
              <div className="flex items-center gap-2">
                <Phone size={14}/>
                {cliente.telefone}
              </div>
            )}

            {cliente.email &&(
              <div className="flex items-center gap-2">
                <Mail size={14}/>
                {cliente.email}
              </div>
            )}

          </div>

          <div className="flex gap-2 mt-4">

            {cliente.telefone &&(
              <a
                href={`https://wa.me/${cliente.telefone}`}
                target="_blank"
                className="btn"
              >
                <MessageCircle size={16}/>
              </a>
            )}

            <button
              onClick={()=>editar(cliente)}
              className="btn"
            >
              <Pencil size={16}/>
            </button>

            <button
              onClick={()=>excluir(cliente.id)}
              className="btn-danger"
            >
              <Trash2 size={16}/>
            </button>

          </div>

        </div>

      ))}

    </div>

  </div>

)

}

function Metric({titulo,valor}:any){

  return(

    <div className="
      bg-gradient-to-br
      from-zinc-900
      to-zinc-800
      border border-zinc-700
      p-6
      rounded-2xl
    ">

      <p className="text-zinc-400 text-sm">
        {titulo}
      </p>

      <p className="text-2xl font-bold mt-1 text-blue-400">
        {valor}
      </p>

    </div>

  )

}