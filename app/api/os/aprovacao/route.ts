import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {

  const { codigo, acao } = await req.json()

  const { data: os } = await supabase
    .from("ordens_servico")
    .select("*")
    .eq("codigo_publico", codigo)
    .single()

  if (!os) {
    return NextResponse.json({ erro: "OS não encontrada" })
  }

  let novoStatus = os.status

  if (acao === "aprovar") {
    novoStatus = "aprovada"
  }

  if (acao === "recusar") {
    novoStatus = "cancelada"
  }

  await supabase
    .from("ordens_servico")
    .update({ status: novoStatus })
    .eq("id", os.id)

  await supabase
    .from("os_historico")
    .insert([
      {
        os_id: os.id,
        empresa_id: os.empresa_id,
        status: novoStatus
      }
    ])

  return NextResponse.json({
    sucesso: true
  })
}