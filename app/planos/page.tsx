"use client"

import { useEffect, useState } from "react"
import { supabase, getUser } from "@/lib/supabase"

export default function Planos() {
  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const [planoAtual, setPlanoAtual] = useState<string>("free")
  const [planos, setPlanos] = useState<any[]>([])

  async function carregarEmpresa() {
    const user = await getUser()
    if (!user) return

    const { data } = await supabase
      .from("empresas")
      .select("id, plano")
      .eq("user_id", user.id)
      .single()

    if (data) {
      setEmpresaId(data.id)
      setPlanoAtual(data.plano)
    }
  }

  async function carregarPlanos() {
    const { data } = await supabase
      .from("planos")
      .select("*")
      .order("valor_mensal", { ascending: true })

    if (data) setPlanos(data)
  }

  async function alterarPlano(novoPlano: string) {
    if (!empresaId) return

    if (novoPlano === "free") {
      await supabase
        .from("empresas")
        .update({
          plano: "free",
          status_assinatura: "ativa",
        })
        .eq("id", empresaId)

      setPlanoAtual("free")
      return
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plano: novoPlano,
        empresaId: empresaId,
      }),
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert("Erro ao iniciar pagamento")
    }
  }

  async function gerenciarAssinatura() {
    if (!empresaId) return

    const res = await fetch("/api/portal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        empresaId: empresaId,
      }),
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert("Erro ao abrir portal de assinatura")
    }
  }

  useEffect(() => {
    async function init() {
      await carregarEmpresa()
      await carregarPlanos()
    }

    init()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get("sucesso")) {
      carregarEmpresa()
    }
  }, [])

  return (
    <div className="space-y-10 max-w-6xl">

      <div>
        <h1 className="text-3xl font-bold">Planos</h1>
        <p className="text-zinc-400 mt-1">
          Escolha o plano ideal para sua empresa
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {planos.map((plano) => {
          const ativo = planoAtual === plano.nome

          return (
            <div
              key={plano.id}
              className={`
                bg-gradient-to-br 
                from-zinc-900 
                to-zinc-800 
                border 
                p-6 
                rounded-2xl 
                transition-all
                ${ativo
                  ? "border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.4)]"
                  : "border-zinc-700 hover:border-blue-500/40"}
              `}
            >
              <h2 className="text-xl font-semibold capitalize">
                {plano.nome}
              </h2>

              <p className="text-3xl font-bold mt-3 text-blue-400">
                {plano.valor_mensal > 0
                  ? `R$ ${plano.valor_mensal}/mês`
                  : "Gratuito"}
              </p>

              <div className="mt-4 space-y-2 text-sm text-zinc-400">
                <p>
                  OS por mês: {plano.limite_os ?? "Ilimitado"}
                </p>
                <p>
                  Produtos: {plano.limite_produtos ?? "Ilimitado"}
                </p>
                <p>
                  Usuários: {plano.limite_usuarios ?? "Ilimitado"}
                </p>
              </div>

              <button
                onClick={() => alterarPlano(plano.nome)}
                disabled={ativo}
                className={`
                  mt-6 w-full py-2.5 rounded-xl transition
                  ${ativo
                    ? "bg-zinc-700 cursor-default"
                    : "bg-blue-600 hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]"}
                `}
              >
                {ativo ? "Plano Atual" : "Escolher Plano"}
              </button>

            </div>
          )
        })}

      </div>

      {(planoAtual === "pro" || planoAtual === "enterprise") && (
        <div className="
          bg-gradient-to-br
          from-zinc-900
          to-zinc-800
          border border-zinc-700
          p-6
          rounded-2xl
          max-w-md
        ">
          <h3 className="text-lg font-semibold mb-3">
            Gerenciar Assinatura
          </h3>

          <p className="text-zinc-400 text-sm mb-4">
            Atualize seu cartão, altere plano ou cancele sua assinatura.
          </p>

          <button
            onClick={gerenciarAssinatura}
            className="
              w-full
              bg-purple-600
              py-2.5
              rounded-xl
              hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]
              transition
            "
          >
            Abrir Portal de Assinatura
          </button>
        </div>
      )}

    </div>
  )
}