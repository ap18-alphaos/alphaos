"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { usePathname, useRouter } from "next/navigation"
import AlphaLoader from "@/components/ui/AlphaLoader"

const ROTAS_PUBLICAS = ["/", "/login", "/register"]

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()
  const pathname = usePathname()

  const [loading, setLoading] = useState(true)
  const [bloqueado, setBloqueado] = useState(false)

  useEffect(() => {
    iniciar()
  }, [pathname])

  async function iniciar() {

    try {

      const { data } = await supabase.auth.getUser()
      const user = data?.user

      /*
      ==================================
      LIBERAR ROTAS PÚBLICAS
      ==================================
      */

      const rotaPublica =
        ROTAS_PUBLICAS.includes(pathname) ||
        pathname.startsWith("/acompanhar")

      // 🔹 Usuário não logado
      if (!user && !rotaPublica) {
        router.push("/login")
        setLoading(false)
        return
      }

      // 🔹 Usuário logado
      if (user) {
        await verificarEmpresa(user.id)
      }

    } catch (error) {
      console.error("Erro no AuthProvider:", error)
    }

    setLoading(false)
  }

  async function verificarEmpresa(userId: string) {

    const { data: empresa, error } = await supabase
      .from("empresas")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Erro ao buscar empresa:", error)
      return
    }

    /*
    ==================================
    CRIAR TRIAL SE EMPRESA NÃO EXISTE
    ==================================
    */

    if (!empresa) {

      const dataExpiracao = new Date()
      dataExpiracao.setDate(dataExpiracao.getDate() + 7)

      await supabase.from("empresas").insert([
        {
          user_id: userId,
          plano: "pro",
          status_assinatura: "trial",
          data_expiracao: dataExpiracao.toISOString(),
        },
      ])

      return
    }

    /*
    ==================================
    VERIFICAR TRIAL
    ==================================
    */

    if (empresa.status_assinatura === "trial") {

      if (!empresa.data_expiracao) return

      const agora = new Date()
      const expiracao = new Date(empresa.data_expiracao)

      if (agora > expiracao) {

        await supabase
          .from("empresas")
          .update({
            plano: "free",
            status_assinatura: "expirada",
          })
          .eq("id", empresa.id)

        setBloqueado(true)
        return
      }

      return
    }

    /*
    ==================================
    ASSINATURA BLOQUEADA
    ==================================
    */

    const bloqueios = [
      "expirada",
      "cancelada",
      "inadimplente",
    ]

    if (bloqueios.includes(empresa.status_assinatura)) {
      setBloqueado(true)
      return
    }

    /*
    ==================================
    ASSINATURA ATIVA
    ==================================
    */

    if (empresa.status_assinatura === "ativa") {
      return
    }
  }

  if (loading) {
    return <AlphaLoader />
  }

  if (bloqueado) {
    return (
      <div className="
        min-h-screen flex items-center justify-center
        bg-gradient-to-br from-zinc-950 via-black to-zinc-900
        text-white
      ">

        <div className="
          bg-gradient-to-br from-zinc-900 to-zinc-800
          border border-red-500/40
          p-10 rounded-2xl
          text-center
          shadow-[0_0_40px_rgba(239,68,68,0.3)]
        ">

          <h1 className="text-2xl font-bold mb-4 text-red-400">
            Assinatura Bloqueada
          </h1>

          <p className="text-zinc-400 mb-6">
            Seu acesso ao sistema está bloqueado.
            <br />
            Regularize sua assinatura para continuar utilizando o Alpha System.
          </p>

          <button
            onClick={() => router.push("/planos")}
            className="
              bg-blue-600
              px-6 py-2.5
              rounded-xl
              hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]
              transition
            "
          >
            Ver Planos
          </button>

        </div>

      </div>
    )
  }

  return <>{children}</>
}