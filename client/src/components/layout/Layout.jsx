import Header from './Header'
import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0c1220]">
      <Header />

      <main className="flex-1 pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0f1a] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/a/a2/National_Football_League_logo.svg"
                  alt="NFL"
                  className="w-10 h-10"
                />
                <div>
                  <h3 className="font-display text-xl text-white">QUINIELA</h3>
                  <p className="text-xs text-white/50">Super Bowl LX</p>
                </div>
              </div>
              <p className="text-sm text-white/50">
                Haz tus predicciones y compite con amigos en la quiniela del Super Bowl.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-heading text-sm text-white mb-4">NAVEGACION</h4>
              <nav className="space-y-2">
                <Link to="/" className="block text-sm text-white/60 hover:text-white transition-colors">
                  Inicio
                </Link>
                <Link to="/predictions" className="block text-sm text-white/60 hover:text-white transition-colors">
                  Predicciones
                </Link>
                <Link to="/leaderboard" className="block text-sm text-white/60 hover:text-white transition-colors">
                  Ranking
                </Link>
              </nav>
            </div>

            {/* Info */}
            <div>
              <h4 className="font-heading text-sm text-white mb-4">SUPER BOWL LX</h4>
              <p className="text-sm text-white/50 mb-2">
                Seahawks vs Patriots
              </p>
              <p className="text-sm text-white/50 mb-2">
                8 de Febrero, 2026
              </p>
              <p className="text-sm text-white/50">
                Levi's Stadium, Santa Clara
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              No afiliado con la NFL. Solo para entretenimiento.
            </p>
            <p className="text-xs text-white/40">
              2026 Quiniela Super Bowl
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
