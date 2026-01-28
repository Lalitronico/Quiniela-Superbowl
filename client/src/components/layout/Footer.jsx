export default function Footer() {
  return (
    <footer className="bg-stadium-dark border-t border-white/10 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/football.svg" alt="Football" className="w-6 h-6" />
            <span className="font-display text-lg text-superbowl-gold">
              QUINIELA SUPER BOWL 2025
            </span>
          </div>

          <p className="text-white/50 text-sm text-center">
            Hecho con pasion por el futbol americano
          </p>

          <div className="flex items-center gap-4">
            <span className="text-white/30 text-xs">
              No afiliado con la NFL
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
