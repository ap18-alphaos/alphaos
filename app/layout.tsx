import "./globals.css"
import Sidebar from "@/components/layout/sidebar"
import Topbar from "@/components/layout/Topbar"
import AuthProvider from "./AuthProvider"
import CommandCenter from "@/components/CommandCenter"
import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-black text-zinc-100 antialiased overflow-x-hidden">

        {/* NOTIFICAÇÕES GLOBAIS */}
        <Toaster
          position="top-right"
          theme="dark"
          richColors
        />

        {/* COMMAND CENTER (Ctrl + K) */}
        <CommandCenter />

        {/* BACKGROUND GLOBAL PREMIUM */}
        <div className="fixed inset-0 -z-10">

          {/* gradiente principal */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_40%),linear-gradient(to_bottom_right,#09090b,#111827,#000000)]" />

          {/* glow azul */}
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[200px]" />

        </div>

        <AuthProvider>

          <div className="flex min-h-screen">

            {/* SIDEBAR */}
            <Sidebar />

            {/* ÁREA DIREITA */}
            <div className="flex-1 ml-64 flex flex-col">

              {/* TOPO */}
              <Topbar />

              {/* CONTEÚDO */}
              <main className="flex-1 p-10 lg:p-12">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>

            </div>

          </div>

        </AuthProvider>

      </body>
    </html>
  )
}