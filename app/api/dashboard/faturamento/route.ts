import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {

  const { data } = await supabase
    .from("financeiro")
    .select("valor, criado_em")
    .order("criado_em", { ascending: true })

  const dias: any = {}

  data?.forEach(item => {

    const dataFormatada = new Date(item.criado_em)
      .toISOString()
      .slice(0,10)

    if(!dias[dataFormatada]){
      dias[dataFormatada] = 0
    }

    dias[dataFormatada] += Number(item.valor)

  })

  const resultado = Object.keys(dias).map(dia => ({
    dia,
    valor: dias[dia]
  }))

  return NextResponse.json(resultado)

}