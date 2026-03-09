import { supabase } from "@/lib/supabase"

export async function verificarLimiteOS(empresaId: string) {
  const { data: empresa } = await supabase
    .from("empresas")
    .select("plano")
    .eq("id", empresaId)
    .single()

  if (!empresa) return false

  if (empresa.plano === "pro" || empresa.plano === "enterprise") {
    return true
  }

  // Free → verificar quantidade
  const { count } = await supabase
    .from("ordens_servico")
    .select("*", { count: "exact", head: true })
    .eq("empresa_id", empresaId)

  return (count || 0) < 30
}