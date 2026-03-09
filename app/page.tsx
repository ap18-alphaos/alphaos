"use client"

import Link from "next/link"

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="
        min-h-screen
        flex
        flex-col
        items-center
        justify-center
        text-center
        px-6
        bg-gradient-to-br
        from-black
        via-zinc-950
        to-zinc-900
      ">

        <h1 className="
          text-5xl
          font-bold
          text-blue-400
          mb-6
          tracking-tight
        ">
          Alpha System
        </h1>

        <p className="
          text-xl
          text-zinc-400
          max-w-2xl
          mb-10
        ">
          Sistema completo para assistência técnica.
          <br />
          Controle ordens de serviço, vendas, estoque e financeiro
          em um único lugar.
        </p>

        <div className="flex gap-6">

          <Link
            href="/register"
            className="
              bg-blue-600
              px-8
              py-3
              rounded-xl
              text-lg
              hover:shadow-[0_0_30px_rgba(59,130,246,0.8)]
              transition
            "
          >
            Começar Grátis
          </Link>

          <Link
            href="/login"
            className="
              border border-zinc-700
              px-8
              py-3
              rounded-xl
              text-lg
              hover:border-blue-500
              hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]
              transition
            "
          >
            Entrar
          </Link>

        </div>

      </section>

      {/* FEATURES */}

      <section className="py-24 px-8 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-16">
          Tudo que sua assistência precisa
        </h2>

        <div className="grid grid-cols-3 gap-10">

          <Feature
            titulo="Ordens de Serviço"
            desc="Controle completo do fluxo técnico, diagnóstico, aprovação e entrega."
          />

          <Feature
            titulo="Controle de Estoque"
            desc="Gerencie peças, alertas de estoque baixo e movimentações."
          />

          <Feature
            titulo="Vendas Integradas"
            desc="Venda produtos e serviços com atualização automática do estoque."
          />

          <Feature
            titulo="Financeiro"
            desc="Entradas e saídas registradas automaticamente."
          />

          <Feature
            titulo="Relatórios"
            desc="Visualize faturamento, ticket médio e evolução do negócio."
          />

          <Feature
            titulo="Sistema em Nuvem"
            desc="Acesse de qualquer lugar com segurança total."
          />

        </div>

      </section>

      {/* PLANOS */}

      <section className="
        py-24
        px-8
        bg-gradient-to-br
        from-zinc-950
        to-black
      ">

        <h2 className="text-3xl font-bold text-center mb-16">
          Planos
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8">

          <Plano
            nome="Free"
            preco="Gratuito"
            desc="Ideal para começar"
          />

          <Plano
            nome="Pro"
            preco="R$ 99/mês"
            destaque
            desc="Para assistências em crescimento"
          />

          <Plano
            nome="Enterprise"
            preco="R$ 299/mês"
            desc="Para empresas maiores"
          />

        </div>

      </section>

      {/* CTA */}

      <section className="py-24 text-center">

        <h2 className="text-3xl font-bold mb-6">
          Comece a organizar sua assistência hoje
        </h2>

        <Link
          href="/register"
          className="
            bg-blue-600
            px-10
            py-4
            rounded-xl
            text-lg
            hover:shadow-[0_0_30px_rgba(59,130,246,0.8)]
            transition
          "
        >
          Criar Conta Grátis
        </Link>

      </section>

    </div>
  )
}

function Feature({ titulo, desc }: any) {
  return (
    <div className="
      bg-gradient-to-br
      from-zinc-900
      to-zinc-800
      border border-zinc-700
      p-6
      rounded-2xl
      hover:border-blue-500/40
      transition
    ">
      <h3 className="font-semibold text-lg mb-2">
        {titulo}
      </h3>
      <p className="text-zinc-400 text-sm">
        {desc}
      </p>
    </div>
  )
}

function Plano({ nome, preco, desc, destaque }: any) {
  return (
    <div className={`
      p-8
      rounded-2xl
      border
      bg-gradient-to-br
      from-zinc-900
      to-zinc-800
      ${destaque
        ? "border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.4)]"
        : "border-zinc-700"}
    `}>

      <h3 className="text-xl font-semibold mb-3">
        {nome}
      </h3>

      <p className="text-3xl font-bold text-blue-400 mb-4">
        {preco}
      </p>

      <p className="text-zinc-400 text-sm mb-6">
        {desc}
      </p>

      <Link
        href="/register"
        className="
          block
          text-center
          bg-blue-600
          py-2.5
          rounded-xl
          hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]
          transition
        "
      >
        Começar
      </Link>

    </div>
  )
}