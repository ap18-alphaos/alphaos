"use client"

import { useEffect, useState } from "react"
import { getUser, supabase } from "@/lib/supabase"
import BuscaGlobal from "@/components/BuscaGlobal"

export default function Topbar() {
  const [userEmail, setUserEmail] = useState("")
  const [diasRestantes, setDiasRestantes] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const user = await getUser()
      if (!user) return

      setUserEmail(user.email || "")

      const { data: empresa } = await supabase
        .from("empresas")
        .select("status_assinatura, data_expiracao")
        .eq("user_id", user.id)
        .single()

      if (
        empresa &&
        empresa.status_assinatura === "trial" &&
        empresa.data_expiracao
      ) {
        const agora = new Date()
        const expiracao = new Date(empresa.data_expiracao)

        const diff = expiracao.getTime() - agora.getTime()
        const dias = Math.ceil(diff / (1000 * 60 * 60 * 24))

        if (dias > 0) {
          setDiasRestantes(dias)
        } else {
          setDiasRestantes(0)
        }
      }
    }

    load()
  }, [])

  const hoje = new Date().toLocaleDateString("pt-BR")

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 flex flex-col">

      {/* BANNER TRIAL */}
      {diasRestantes !== null && (
        <div className="
          text-center text-sm
          py-2
          bg-gradient-to-r from-blue-900/40 to-purple-900/40
          border-b border-blue-500/30
          text-blue-300
        ">
          ⏳ Seu trial termina em{" "}
          <span className="font-semibold text-white">
            {diasRestantes} {diasRestantes === 1 ? "dia" : "dias"}
          </span>
        </div>
      )}

      {/* BARRA PRINCIPAL */}
      <div className="h-20 flex items-center justify-between px-8">

        {/* ESQUERDA */}
        <div>
          <p className="text-sm text-zinc-400">
            {hoje}
          </p>
          <h2 className="text-lg font-semibold">
            Bem-vindo 👋
          </h2>
        </div>

        {/* BUSCA GLOBAL */}
        <div className="hidden lg:block">
          <BuscaGlobal />
        </div>

        {/* DIREITA */}
        <div className="flex items-center gap-4">

          <div className="text-right">
            <p className="text-sm text-zinc-400">Usuário</p>
            <p className="font-medium">{userEmail}</p>
          </div>

          <div className="
            w-10 h-10 rounded-full 
            bg-blue-600 
            flex items-center justify-center 
            font-bold
            shadow-[0_0_15px_rgba(59,130,246,0.6)]
          ">
            {userEmail ? userEmail[0].toUpperCase() : "U"}
          </div>

        </div>

      </div>

    </header>
  )
}