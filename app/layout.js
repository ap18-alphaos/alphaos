import './globals.css'
import Link from 'next/link'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-white">

        <div className="flex min-h-screen">

          <aside className="w-60 bg-zinc-900 border-r border-zinc-800 p-4 space-y-4">

            <h1 className="text-xl font-bold mb-6">ALPHA OS</h1>

            <nav className="space-y-2">

              <Link href="/dashboard" className="block p-2 rounded hover:bg-zinc-800">
                Dashboard
              </Link>

              <Link href="/clientes" className="block p-2 rounded hover:bg-zinc-800">
                Clientes
              </Link>

              <Link href="/aparelhos" className="block p-2 rounded hover:bg-zinc-800">
                Aparelhos
              </Link>

              <Link href="/os" className="block p-2 rounded hover:bg-zinc-800">
                Ordens de Serviço
              </Link>

              <Link href="/financeiro" className="block p-2 rounded hover:bg-zinc-800">
                Financeiro
              </Link>

            </nav>

          </aside>

          <main className="flex-1">
            {children}
          </main>

        </div>

      </body>
    </html>
  )
}