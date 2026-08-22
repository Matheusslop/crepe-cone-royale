import { NavLink, Link, useNavigate } from 'react-router-dom'
import { LogOut, ArrowLeft } from 'lucide-react'

const TABS = [
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/cardapio', label: 'Cardápio' },
  { to: '/admin/senha', label: 'Senha' },
]

export default function AdminLayout({ onLogout, children }) {
  const navigate = useNavigate()

  function handleLogout() {
    onLogout()
    navigate('/admin')
  }

  return (
    <div>
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur border-b border-gold/10">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    isActive ? 'text-gold border-gold' : 'text-gray border-transparent hover:text-cream'
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-gray hover:text-cream transition-colors"
            >
              <ArrowLeft size={15} /> <span className="hidden sm:inline">Voltar ao site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray hover:text-cream cursor-pointer"
            >
              <LogOut size={15} /> Sair
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
