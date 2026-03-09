export default function AlphaLoader() {
  return (
    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-zinc-950
      via-black
      to-zinc-900
      relative
      overflow-hidden
    ">

      {/* Glow azul */}
      <div className="
        absolute
        w-[500px]
        h-[500px]
        bg-blue-600/20
        blur-[160px]
        rounded-full
      " />

      <div className="relative text-center">

        <div className="text-3xl font-bold text-blue-400 mb-6 tracking-wide">
          Alpha System
        </div>

        <div className="flex justify-center">

          <div className="
            w-10 h-10
            border-2
            border-blue-500/30
            border-t-blue-400
            rounded-full
            animate-spin
          " />

        </div>

        <p className="text-zinc-500 text-sm mt-6">
          Carregando sistema...
        </p>

      </div>

    </div>
  )
}