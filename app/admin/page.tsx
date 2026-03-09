"use client"

import { useEffect, useState } from "react"
import { supabase, getUser } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [empresas, setEmpresas] = useState(0)
  const [usuarios, setUsuarios] = useState(0)
  const [planosPro, setPlanosPro] = useState(0)
  const [planosEnterprise, setPlanosEnterprise] = useState(0)
  const [bloqueadas, setBloqueadas] = useState(0)
  const [mrr, setMrr] = useState(0)

  async function carregar() {
    const user = await getUser()

    if (!user) {
      router.push("/")
      return
    }

    const { data: empresa } = await supabase
      .from("empresas")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (!empresa?.is_admin) {
      router.push("/")
      return
    }

    const { data: empresasData } = await supabase
      .from("empresas")
      .select("*")

    if (!empresasData) return

    setEmpresas(empresasData.length)

    const pro = empresasData.filter(e => e.plano === "pro")
    const enterprise = empresasData.filter(e => e.plano === "enterprise")

    const suspensas = empresasData.filter(
      e =>
        e.status_assinatura === "suspensa" ||
        e.status_assinatura === "cancelada" ||
        e.status_assinatura === "expirada"
    )

    setPlanosPro(pro.length)
    setPlanosEnterprise(enterprise.length)
    setBloqueadas(suspensas.length)

    const receita =
      pro.length * 99.9 +
      enterprise.length * 299.9

    setMrr(receita)

    setUsuarios(empresasData.length)
    setLoading(false)
  }

  useEffect(() => {
    carregar()
  }, [])

  if (loading) return null

  return (
    <div className="space-y-10 max-w-7xl">

      <div>
        <h1 className="text-3xl font-bold">Admin SaaS</h1>
        <p className="text-zinc-400">
          Painel de controle do Alpha System
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">

        <Card titulo="Empresas cadastradas" valor={empresas} />

        <Card titulo="Usuários ativos" valor={usuarios} />

        <Card titulo="Empresas bloqueadas" valor={bloqueadas} />

        <Card titulo="Planos PRO" valor={planosPro} />

        <Card titulo="Planos ENTERPRISE" valor={planosEnterprise} />

        <Card titulo="MRR estimado" valor={`R$ ${mrr.toFixed(2)}`} />

      </div>

    </div>
  )
}

function Card({ titulo, valor }: any) {
  return (
    <div
      className="
      bg-gradient-to-br 
      from-zinc-900 
      to-zinc-800 
      border border-zinc-700 
      p-6 
      rounded-2xl
      transition-all
      hover:border-blue-500
      hover:shadow-[0_0_25px_rgba(59,130,246,0.35)]
    "
    >
      <p className="text-zinc-400 text-sm">{titulo}</p>

      <p className="text-3xl font-bold mt-2 text-blue-400">
        {valor}
      </p>
    </div>
  )
}