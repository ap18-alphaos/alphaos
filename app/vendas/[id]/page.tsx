"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"

export default function DetalheVenda() {
  const params = useParams()
  const id = params.id as string

  const [venda, setVenda] = useState<any>(null)
  const [itens, setItens] = useState<any[]>([])

  async function carregar() {
    const { data: v } = await supabase
      .from("vendas")
      .select("*")
      .eq("id", id)
      .single()

    const { data: i } = await supabase
      .from("venda_itens")
      .select("*")
      .eq("venda_id", id)

    if (v) setVenda(v)
    if (i) setItens(i)
  }

  useEffect(() => {
    carregar()
  }, [])

  if (!venda) return <div>Carregando...</div>

  return (
    <div className="max-w-3xl space-y-8">

      <h1 className="text-2xl font-bold">
        Venda #{String(venda.numero).padStart(4, "0")}
      </h1>

      <p>
        <strong>Data:</strong>{" "}
        {new Date(venda.criado_em).toLocaleDateString()}
      </p>

      <table className="w-full border border-zinc-800">
        <thead className="bg-zinc-800">
          <tr>
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-left">Qtd</th>
            <th className="p-2 text-left">Valor</th>
            <th className="p-2 text-left">Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {itens.map((i) => (
            <tr key={i.id} className="border-t border-zinc-800">
              <td className="p-2">{i.nome}</td>
              <td className="p-2">{i.quantidade}</td>
              <td className="p-2">R$ {i.valor_unitario}</td>
              <td className="p-2">R$ {i.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-xl font-bold">
        Total: R$ {venda.total}
      </div>

    </div>
  )
}