"use client"

import { useEffect, useState } from "react"
import { supabase, getUser } from "@/lib/supabase"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

export default function Relatorios() {

  const [empresaId, setEmpresaId] = useState<string | null>(null)

  const [dadosGrafico, setDadosGrafico] = useState<any[]>([])

  const [faturamentoTotal, setFaturamentoTotal] = useState(0)
  const [faturamentoMes, setFaturamentoMes] = useState(0)

  const [totalVendas, setTotalVendas] = useState(0)
  const [ticketMedio, setTicketMedio] = useState(0)

  async function carregarEmpresa() {

    const user = await getUser()
    if (!user) return

    const { data } = await supabase
      .from("empresas")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (data) setEmpresaId(data.id)

  }

  async function carregarDados(id: string) {

  const { data } = await supabase
    .from("financeiro")
    .select("*")
    .eq("empresa_id", id)
    .eq("tipo", "entrada")

  if (!data) return

    const agrupado: any = {}

    data.forEach((item) => {

      const dataObj = new Date(item.criado_em)

      const dataFormatada =
        dataObj.getFullYear() +
        "-" +
        String(dataObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dataObj.getDate()).padStart(2, "0")

      if (!agrupado[dataFormatada]) {
        agrupado[dataFormatada] = 0
      }

      agrupado[dataFormatada] += Number(item.valor)

    })

    const grafico = Object.keys(agrupado)
      .sort()
      .map((data) => ({
        data,
        valor: agrupado[data]
      }))

    const total = data.reduce(
      (acc, i) => acc + Number(i.valor),
      0
    )

    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0,0,0,0)

    const mes = data
      .filter((i) =>
        new Date(i.criado_em) >= inicioMes
      )
      .reduce(
        (acc, i) => acc + Number(i.valor),
        0
      )

    setDadosGrafico(grafico)

    setFaturamentoTotal(total)

    setFaturamentoMes(mes)

    setTotalVendas(data.length)

    setTicketMedio(
      data.length ? total / data.length : 0
    )

  }

  useEffect(() => {

    async function init() {
      await carregarEmpresa()
    }

    init()

  }, [])

  useEffect(() => {

    if (empresaId) carregarDados(empresaId)

  }, [empresaId])

  return (

    <div className="space-y-10">

      <div>
        <h1 className="text-3xl font-bold">
          Relatórios
        </h1>

        <p className="text-zinc-400">
          Análise financeira da sua empresa
        </p>
      </div>

      {/* CARDS */}

      <div className="grid grid-cols-4 gap-6">

        <Card
          titulo="Faturamento Total"
          valor={`R$ ${faturamentoTotal.toFixed(2)}`}
        />

        <Card
          titulo="Faturamento do Mês"
          valor={`R$ ${faturamentoMes.toFixed(2)}`}
        />

        <Card
          titulo="Total de Entradas"
          valor={totalVendas}
        />

        <Card
          titulo="Ticket Médio"
          valor={`R$ ${ticketMedio.toFixed(2)}`}
        />

      </div>

      {/* GRÁFICO */}

      <div
        className="
        bg-gradient-to-br 
        from-zinc-900 
        to-zinc-800 
        border border-zinc-700 
        p-6 
        rounded-2xl
        hover:border-blue-500/40
        transition
      "
      >

        <h2 className="mb-6 font-semibold text-lg">
          Faturamento por Dia
        </h2>

        <div style={{ width: "100%", height: 320 }}>

          <ResponsiveContainer>

            <LineChart data={dadosGrafico}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
              />

              <XAxis
                dataKey="data"
                stroke="#9ca3af"
              />

              <YAxis
                stroke="#9ca3af"
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="valor"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

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
      hover:border-blue-500
      hover:shadow-[0_0_25px_rgba(59,130,246,0.35)]
      transition
    "
    >

      <p className="text-sm text-zinc-400">
        {titulo}
      </p>

      <p className="text-2xl font-bold mt-2 text-blue-400">
        {valor}
      </p>

    </div>

  )

}