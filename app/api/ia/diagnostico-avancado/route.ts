import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {

  const { modelo, defeito } = await req.json()

  if (!modelo || !defeito) {
    return NextResponse.json({})
  }

  /* =========================
     BUSCAR BASE DE DEFEITOS
  ========================= */

  const { data } = await supabase
    .from("base_defeitos")
    .select("solucao")
    .ilike("modelo", `%${modelo}%`)
    .ilike("defeito", `%${defeito}%`)
    .limit(50)

  const contagem: Record<string, number> = {}

  data?.forEach((item:any)=>{
    if(!item.solucao) return
    contagem[item.solucao] = (contagem[item.solucao] || 0) + 1
  })

  const ranking = Object.entries(contagem)
    .map(([solucao,total])=>({solucao,total}))
    .sort((a,b)=>b.total-a.total)
    .slice(0,5)

  /* =========================
     IA
  ========================= */

  const prompt = `
Você é especialista em reparo de smartphones.

Modelo: ${modelo}
Problema: ${defeito}

Sugira possíveis causas técnicas.
`

  const resposta = await openai.chat.completions.create({
    model:"gpt-4.1-mini",
    messages:[
      { role:"user", content:prompt }
    ],
    temperature:0.2
  })

  const ia = resposta.choices[0].message.content

  return NextResponse.json({
    ia,
    base:ranking,
    casos:data?.length || 0
  })

}