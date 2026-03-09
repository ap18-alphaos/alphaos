import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const modelo = body?.modelo

    if (!modelo) {
      return NextResponse.json({
        casos:0,
        ranking:[]
      })
    }

    const { data, error } = await supabase
      .from("base_defeitos")
      .select("solucao")
      .ilike("modelo", `%${modelo}%`)

    if (error) {
      console.error("ERRO SUPABASE:", error)
      return NextResponse.json({
        casos:0,
        ranking:[]
      })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        casos:0,
        ranking:[]
      })
    }

    const contagem: Record<string, number> = {}

    data.forEach(item => {

      if (!item.solucao) return

      contagem[item.solucao] =
        (contagem[item.solucao] || 0) + 1

    })

    const ranking = Object.entries(contagem)
      .map(([solucao,total]) => ({
        solucao,
        total
      }))
      .sort((a,b)=>b.total-a.total)

    return NextResponse.json({
      casos:data.length,
      ranking:ranking.slice(0,5)
    })

  } catch (error) {

    console.error("ERRO API:", error)

    return NextResponse.json({
      casos:0,
      ranking:[]
    })

  }

}