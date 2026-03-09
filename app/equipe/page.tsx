"use client"

import { useEffect, useState } from "react"
import { supabase, getUser } from "@/lib/supabase"

export default function EquipePage() {
  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const [usuarios, setUsuarios] = useState<any[]>([])

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("tecnico")

  async function carregarEmpresa() {
    const user = await getUser()
    if (!user) return

    const { data } = await supabase
      .from("empresas")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (data) {
      setEmpresaId(data.id)
      carregarUsuarios(data.id)
    }
  }

  async function carregarUsuarios(id: string) {
    const { data } = await supabase
      .from("usuarios_empresa")
      .select("*")
      .eq("empresa_id", id)
      .order("criado_em", { ascending: false })

    if (data) setUsuarios(data)
  }

  async function adicionarUsuario() {
    if (!empresaId) return
    if (!nome || !email) return

    const { error } = await supabase
      .from("usuarios_empresa")
      .insert([
        {
          empresa_id: empresaId,
          nome,
          email,
          role,
        },
      ])

    if (!error) {
      setNome("")
      setEmail("")
      setRole("tecnico")
      carregarUsuarios(empresaId)
    }
  }

  async function removerUsuario(id: string) {
    await supabase
      .from("usuarios_empresa")
      .delete()
      .eq("id", id)

    if (empresaId) carregarUsuarios(empresaId)
  }

  useEffect(() => {
    carregarEmpresa()
  }, [])

  return (
    <div className="space-y-10 max-w-5xl">

      <div>
        <h1 className="text-3xl font-bold">Equipe</h1>
        <p className="text-zinc-400">
          Gerencie os usuários da sua empresa
        </p>
      </div>

      {/* ADICIONAR USUÁRIO */}

      <div className="
        bg-gradient-to-br 
        from-zinc-900 
        to-zinc-800 
        border border-zinc-700 
        p-6 
        rounded-2xl 
        space-y-4
      ">

        <h2 className="text-lg font-semibold">
          Adicionar Funcionário
        </h2>

        <div className="grid grid-cols-3 gap-3">

          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg"
          >
            <option value="admin">Administrador</option>
            <option value="tecnico">Técnico</option>
            <option value="atendente">Atendente</option>
          </select>

        </div>

        <button
          onClick={adicionarUsuario}
          className="
            bg-blue-600 
            px-6 py-2.5 
            rounded-xl
            hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]
            transition
          "
        >
          Adicionar
        </button>

      </div>

      {/* LISTA */}

      <div className="space-y-4">

        {usuarios.map((u) => (
          <div
            key={u.id}
            className="
              bg-gradient-to-br 
              from-zinc-900 
              to-zinc-800 
              border border-zinc-700 
              p-4 
              rounded-xl 
              flex justify-between items-center
              hover:border-blue-500/40
              transition
            "
          >

            <div>
              <p className="font-semibold">{u.nome}</p>
              <p className="text-sm text-zinc-400">{u.email}</p>
            </div>

            <div className="flex items-center gap-4">

              <span className="
                text-xs 
                px-3 py-1 
                rounded-full 
                bg-blue-500/20 
                text-blue-400
              ">
                {u.role}
              </span>

              <button
                onClick={() => removerUsuario(u.id)}
                className="
                  text-red-400
                  hover:text-red-300
                  transition
                "
              >
                Remover
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}