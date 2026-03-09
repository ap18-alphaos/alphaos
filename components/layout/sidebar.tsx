"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"

import {
  LayoutDashboard,
  Users,
  Package,
  Wrench,
  ShoppingCart,
  ClipboardList,
  DollarSign,
  BarChart3,
  LogOut,
  CreditCard,
  BrainCircuit,
  BookOpen,
  Menu
} from "lucide-react"

const menuPrincipal = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Produtos", href: "/produtos", icon: Package },
  { name: "Serviços", href: "/servicos", icon: Wrench },
  { name: "Vendas", href: "/vendas", icon: ShoppingCart },
  { name: "Ordens de Serviço", href: "/os", icon: ClipboardList },
  { name: "Financeiro", href: "/financeiro", icon: DollarSign },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
]

const menuIA = [
  { name: "Diagnóstico IA", href: "/ia-diagnostico", icon: BrainCircuit },
  { name: "Biblioteca Técnica", href: "/biblioteca", icon: BookOpen },
]

const menuSistema = [
  { name: "Planos", href: "/planos", icon: CreditCard },
]

export default function Sidebar() {

  const router = useRouter()
  const pathname = usePathname()

  const [open,setOpen] = useState(false)

  async function logout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  function renderMenu(items: any[]) {
    return items.map((item) => {

      const Icon = item.icon

      const active =
        pathname === item.href ||
        pathname.startsWith(item.href + "/")

      return (
        <Link
          key={item.name}
          href={item.href}
          onClick={()=>setOpen(false)}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl
            transition-all duration-200 group
            ${active
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"}
          `}
        >
          <Icon
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          {item.name}
        </Link>
      )
    })
  }

  return (
    <>
    
      {/* BOTÃO MENU MOBILE */}
      <button
        onClick={()=>setOpen(true)}
        className="
          md:hidden
          fixed
          top-4
          left-4
          z-50
          bg-zinc-900
          border border-zinc-700
          p-2
          rounded-lg
        "
      >
        <Menu size={20}/>
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={()=>setOpen(false)}
          className="
            fixed inset-0
            bg-black/50
            z-40
            md:hidden
          "
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64
          bg-gradient-to-b from-zinc-900 via-zinc-950 to-black
          border-r border-zinc-800
          flex flex-col justify-between
          shadow-2xl
          transform transition-transform duration-300 z-50

          ${open ? "translate-x-0" : "-translate-x-full"}

          md:translate-x-0
        `}
      >

        {/* TOPO */}
        <div>

          {/* LOGO */}
          <div className="p-6">

            <div className="text-2xl font-bold text-blue-400 tracking-wide">
              Alpha System
            </div>

            <p className="text-xs text-zinc-500 mt-1">
              Plataforma inteligente
            </p>

          </div>

          {/* MENU PRINCIPAL */}
          <nav className="px-3 space-y-2 text-sm">

            {renderMenu(menuPrincipal)}

          </nav>

          {/* IA */}
          <div className="px-5 mt-6 mb-2 text-xs text-zinc-500 uppercase tracking-wider">
            Inteligência
          </div>

          <nav className="px-3 space-y-2 text-sm">

            {renderMenu(menuIA)}

          </nav>

          {/* SISTEMA */}
          <div className="px-5 mt-6 mb-2 text-xs text-zinc-500 uppercase tracking-wider">
            Sistema
          </div>

          <nav className="px-3 space-y-2 text-sm">

            {renderMenu(menuSistema)}

          </nav>

        </div>

        {/* RODAPÉ */}
        <div className="p-4 border-t border-zinc-800">

          <button
            onClick={logout}
            className="
              w-full flex items-center justify-center gap-2
              bg-red-600/90 hover:bg-red-600
              py-2.5 rounded-xl text-sm
              transition-all duration-200
            "
          >
            <LogOut size={16} />
            Sair
          </button>

        </div>

      </aside>

    </>
  )
}