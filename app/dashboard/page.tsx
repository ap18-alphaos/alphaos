"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function Dashboard() {

  const [dados,setDados] = useState<any>(null)
  const [grafico,setGrafico] = useState<any[]>([])

  async function carregar(){

    const res = await fetch("/api/dashboard")
    const data = await res.json()
    setDados(data)

    const resGrafico = await fetch("/api/dashboard/faturamento")
    const dataGrafico = await resGrafico.json()

    setGrafico(dataGrafico)

  }

  useEffect(()=>{
    carregar()
  },[])

  if(!dados) return <div className="text-zinc-400">Carregando dashboard...</div>

  return(

  <div className="space-y-8">

    <div>

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="text-zinc-400 mt-1">
        Visão geral da sua assistência
      </p>

    </div>

    {/* CARDS */}

    <div className="grid grid-cols-4 gap-6">

      <Card titulo="OS Abertas" valor={dados.abertas} cor="blue" />
      <Card titulo="Em Reparo" valor={dados.reparo} cor="purple" />
      <Card titulo="Finalizadas" valor={dados.finalizadas} cor="green" />
      <Card titulo="Faturamento" valor={`R$ ${dados.faturamento.toFixed(2)}`} cor="emerald" />

    </div>

    <div className="grid grid-cols-4 gap-6">

      <Card titulo="Vendas do mês" valor={dados.vendasMes || 0} cor="cyan" />
      <Card titulo="Clientes" valor={dados.clientes || 0} cor="orange" />
      <Card titulo="Estoque mínimo" valor={dados.estoqueMinimo || 0} cor="red" />
      <Card titulo="Produtos cadastrados" valor={dados.produtos || 0} cor="yellow" />

    </div>

    {/* GRÁFICO */}

    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 p-6 rounded-xl">

      <h2 className="text-lg font-semibold mb-4">
        Faturamento
      </h2>

      <div className="h-72">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={grafico}>

            <XAxis dataKey="dia" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="valor"
              stroke="#3b82f6"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  </div>

)

}

function Card({titulo,valor,cor}:any){

  const cores:any={
    blue:"border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]",
    purple:"border-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]",
    green:"border-green-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]",
    emerald:"border-emerald-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]",
    cyan:"border-cyan-500 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]",
    orange:"border-orange-500 hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]",
    red:"border-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.6)]",
    yellow:"border-yellow-500 hover:shadow-[0_0_25px_rgba(234,179,8,0.6)]"
  }

  return(

    <div className={`

      bg-gradient-to-br
      from-zinc-900
      to-zinc-800
      border
      ${cores[cor]}
      p-6
      rounded-xl
      transition
      duration-300

    `}

    >

      <p className="text-zinc-400 text-sm">
        {titulo}
      </p>

      <p className="text-3xl font-bold mt-2">
        {valor}
      </p>

    </div>

  )

}