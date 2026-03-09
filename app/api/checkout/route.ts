import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  


export async function POST(req: Request) {
  try {
    const { plano, empresaId } = await req.json()

    const valores: any = {
      pro: 9990,
      enterprise: 29990,
    }

    if (!valores[plano]) {
      return NextResponse.json(
        { error: "Plano inválido" },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Plano ${plano.toUpperCase()} - Alpha System`,
            },
            unit_amount: valores[plano],
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],

      // 🔥 ESSA PARTE É A CHAVE
      metadata: {
        plano,
        empresa_id: empresaId,
      },

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/planos?sucesso=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/planos?cancelado=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}