import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {

  const { termo } = await req.json()

  if (!termo) {
    return NextResponse.json({ resultados: [] })
  }

  const clientes = await supabase
    .from("clientes")
    .select("id,nome,telefone")
    .ilike("nome", `%${termo}%`)
    .limit(5)

  const produtos = await supabase
    .from("produtos")
    .select("id,nome")
    .ilike("nome", `%${termo}%`)
    .limit(5)

  const os = await supabase
    .from("ordens_servico")
    .select("id,numero,modelo")
    .ilike("modelo", `%${termo}%`)
    .limit(5)

  return NextResponse.json({
    clientes: clientes.data || [],
    produtos: produtos.data || [],
    os: os.data || []
  })

}