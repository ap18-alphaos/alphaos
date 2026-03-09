"use client"

import { useEffect, useState } from "react"
import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import {
  Search,
  LayoutDashboard,
  Users,
  ClipboardList,
  BrainCircuit,
  Package
} from "lucide-react"

type Cliente = {
  id: string
  nome: string
}

export default function CommandCenter() {

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [clientes, setClientes] = useState<Cliente[]>([])

  const router = useRouter()

  useEffect(() => {

    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)

  }, [])

  useEffect(() => {

    async function buscarClientes() {

      if (search.length < 2) {
        setClientes([])
        return
      }

      const { data } = await supabase
        .from("clientes")
        .select("id, nome")
        .ilike("nome", `%${search}%`)
        .limit(5)

      if (data) {
        setClientes(data)
      }

    }

    buscarClientes()

  }, [search])

  function go(path: string) {
    router.push(path)
    setOpen(false)
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      className="
        fixed top-[18%] left-1/2
        -translate-x-1/2
        w-[95%] max-w-xl
        bg-zinc-900
        border border-zinc-700
        rounded-2xl
        shadow-[0_0_60px_rgba(0,0,0,0.7)]
        p-4
        z-50
      "
    >

      {/* INPUT */}
      <div className="flex items-center gap-2 border-b border-zinc-700 pb-3">

        <Search size={16} className="text-zinc-500" />

        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Buscar cliente, OS, produto..."
          className="
            w-full
            bg-transparent
            outline-none
            text-sm
          "
        />

      </div>

      <Command.List className="mt-4 space-y-4 max-h-[350px] overflow-y-auto">

        {/* CLIENTES */}
        {clientes.length > 0 && (
          <Command.Group heading="Clientes">

            {clientes.map(cliente => (
              <Command.Item
                key={cliente.id}
                onSelect={() => go(`/clientes/${cliente.id}`)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer"
              >
                <Users size={16} />
                {cliente.nome}
              </Command.Item>
            ))}

          </Command.Group>
        )}

        {/* AÇÕES */}
        <Command.Group heading="Ações rápidas">

          <Command.Item
            onSelect={() => go("/os/nova")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            <ClipboardList size={16} />
            Criar nova OS
          </Command.Item>

          <Command.Item
            onSelect={() => go("/ia-diagnostico")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            <BrainCircuit size={16} />
            Diagnóstico IA
          </Command.Item>

        </Command.Group>

        {/* NAVEGAÇÃO */}
        <Command.Group heading="Navegação">

          <Command.Item
            onSelect={() => go("/dashboard")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Command.Item>

          <Command.Item
            onSelect={() => go("/clientes")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            <Users size={16} />
            Clientes
          </Command.Item>

          <Command.Item
            onSelect={() => go("/produtos")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            <Package size={16} />
            Produtos
          </Command.Item>

          <Command.Item
            onSelect={() => go("/os")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            <ClipboardList size={16} />
            Ordens de Serviço
          </Command.Item>

        </Command.Group>

      </Command.List>

    </Command.Dialog>
  )
}