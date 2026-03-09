import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {

  const { data: abertas } = await supabase
    .from("ordens_servico")
    .select("id", { count: "exact", head: true })
    .eq("status", "aberta")

  const { data: reparo } = await supabase
    .from("ordens_servico")
    .select("id", { count: "exact", head: true })
    .eq("status", "em_reparo")

  const { data: finalizadas } = await supabase
    .from("ordens_servico")
    .select("id", { count: "exact", head: true })
    .eq("status", "finalizada")

  const { data: financeiro } = await supabase
    .from("financeiro")
    .select("valor")

  let total = 0

  financeiro?.forEach(f => {
    total += Number(f.valor)
  })

  return NextResponse.json({
    abertas: abertas?.length || 0,
    reparo: reparo?.length || 0,
    finalizadas: finalizadas?.length || 0,
    faturamento: total
  })
}