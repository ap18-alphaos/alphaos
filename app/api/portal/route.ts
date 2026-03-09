import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {

  try {

    const { empresaId } = await req.json()

    const { data: empresa } = await supabase
      .from("empresas")
      .select("stripe_customer_id")
      .eq("id", empresaId)
      .single()

    if (!empresa?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Cliente Stripe não encontrado" },
        { status: 400 }
      )
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: empresa.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/planos`,
    })

    return NextResponse.json({
      url: portal.url
    })

  } catch (err: any) {

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )

  }

}