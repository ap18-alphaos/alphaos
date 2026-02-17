'use client'

import Link from 'next/link'

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-52 bg-zinc-900 text-white flex flex-col p-4">

      <h1 className="text-xl font-bold mb-8">AlphaOS</h1>

      <nav className="flex flex-col gap-4 text-sm">

        <Link className="hover:text-green-400 block" href="/dashboard">
          Dashboard
        </Link>

        <Link className="hover:text-green-400 block" href="/clientes">
          Clientes
        </Link>

        <Link className="hover:text-green-400 block" href="/aparelhos">
          Aparelhos
        </Link>

        <Link className="hover:text-green-400 block" href="/os">
          Nova OS
        </Link>

        <Link className="hover:text-green-400 block" href="/financeiro">
          Financeiro
        </Link>

      </nav>

    </div>
  )
}