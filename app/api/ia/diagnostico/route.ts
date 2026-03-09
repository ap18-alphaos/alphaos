import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const texto =
      body.texto ||
      body.input ||
      body.message ||
      ""

    if(!texto){

      return NextResponse.json({
        sucesso:false,
        erro:"Texto vazio"
      })

    }

    const prompt = `
Você é um especialista em assistência técnica de smartphones.

Analise o texto abaixo e extraia:

cliente
aparelho
problema

Texto:
${texto}

Responda APENAS em JSON válido neste formato:

{
  "cliente": "",
  "aparelho": "",
  "problema": ""
}
`

    const response = await openai.chat.completions.create({

      model: "gpt-4.1-mini",

      messages: [
        {
          role: "user",
          content: prompt
        }
      ],

      temperature: 0.2

    })

    let content = response.choices?.[0]?.message?.content || ""

    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    let parsed

    try {

      parsed = JSON.parse(content)

    } catch {

      parsed = {
        cliente: "",
        aparelho: "",
        problema: content
      }

    }

    return NextResponse.json({

      sucesso: true,

      resultado: parsed

    })

  } catch (error) {

    console.error("Erro IA:", error)

    return NextResponse.json(
      {
        sucesso: false,
        erro: "Erro ao processar diagnóstico"
      },
      { status: 500 }
    )
  }

}