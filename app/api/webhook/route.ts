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

  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    console.log("❌ Assinatura Stripe não encontrada")
    return NextResponse.json({ error: "Sem assinatura" }, { status: 400 })
  }

  let event: Stripe.Event

  try {

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

  } catch (err: any) {

    console.log("❌ Erro validação assinatura:", err.message)

    return NextResponse.json(
      { error: "Webhook signature inválida." },
      { status: 400 }
    )

  }

  console.log("🔔 Evento recebido:", event.type)

  /*
  ================================
  PAGAMENTO CONCLUÍDO
  ================================
  */

  if (event.type === "checkout.session.completed") {

    const session = event.data.object as Stripe.Checkout.Session

    console.log("✅ Checkout finalizado")

    const plano = session.metadata?.plano
    let empresaId = session.metadata?.empresa_id

    if (!plano || !empresaId) {
      console.log("❌ Metadata incompleta")
      return NextResponse.json({ received: true })
    }

    empresaId = empresaId.trim()

    await supabase
      .from("empresas")
      .update({
        plano: plano,
        status_assinatura: "ativa",
        stripe_customer_id: session.customer?.toString() || null,
        stripe_subscription_id: session.subscription?.toString() || null,
      })
      .eq("id", empresaId)

    console.log("✅ Plano atualizado para:", plano)

  }

  /*
  ================================
  CANCELAMENTO DE ASSINATURA
  ================================
  */

  if (event.type === "customer.subscription.deleted") {

    const subscription = event.data.object as Stripe.Subscription

    console.log("⚠ Assinatura cancelada")

    await supabase
      .from("empresas")
      .update({
        status_assinatura: "cancelada",
      })
      .eq("stripe_subscription_id", subscription.id)

  }

  /*
  ================================
  FALHA DE PAGAMENTO
  ================================
  */

  if (event.type === "invoice.payment_failed") {

    const invoice = event.data.object as Stripe.Invoice

    console.log("⚠ Pagamento falhou")

    await supabase
      .from("empresas")
      .update({
        status_assinatura: "inadimplente",
      })
      .eq("stripe_customer_id", invoice.customer?.toString())

  }

  /*
  ================================
  PAGAMENTO CONFIRMADO
  ================================
  */

  if (event.type === "invoice.payment_succeeded") {

    const invoice = event.data.object as Stripe.Invoice

    console.log("💰 Pagamento confirmado")

    await supabase
      .from("empresas")
      .update({
        status_assinatura: "ativa",
      })
      .eq("stripe_customer_id", invoice.customer?.toString())

  }

  return NextResponse.json({ received: true })

}