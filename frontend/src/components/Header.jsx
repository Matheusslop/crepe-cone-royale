import { Link } from 'react-router-dom'
import { ShoppingBag, Search } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Header({ onOpenCart }) {
  const { count } = useCart()
  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-gold/20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#1A1A1A"/>
            <polygon points="10,44 16,22 26,34 32,16 38,34 48,22 54,44" fill="#F5C518"/>
          </svg>
          <div className="leading-none">
            <span className="font-display text-xl sm:text-2xl text-gold tracking-wide">CONE ROYALE</span>
            <p className="text-[10px] text-orange font-medium tracking-widest uppercase hidden sm:block">Crepes no Cone</p>
          </div>
        </Link>

        {/* Nav + actions */}
        <div className="flex items-center gap-2">
          {/* Acompanhar link */}
          <Link
            to="/acompanhar"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gold/25 text-gold text-xs font-semibold hover:bg-gold/10 transition-colors"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Acompanhar pedido</span>
            <span className="sm:hidden">Pedido</span>
          </Link>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-gold text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-gold-light transition-colors cursor-pointer"
          >
            <ShoppingBag size={17} />
            <span className="hidden sm:inline">Carrinho</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
