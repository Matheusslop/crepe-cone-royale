import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Header({ onOpenCart }) {
  const { count } = useCart()
  return (
    <header className="sticky top-0 z-40 bg-batter/95 backdrop-blur border-b border-wine/10">
      <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-wine flex items-center justify-center">
            <span className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[11px] border-b-caramel" />
          </span>
          <span className="font-display italic text-2xl text-wine leading-none">Crepe Cone Royale</span>
        </Link>
        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-2 bg-wine text-batter px-4 py-2 rounded-full hover:bg-wine-dark transition-colors cursor-pointer"
        >
          <ShoppingBag size={18} />
          <span className="text-sm font-medium hidden sm:inline">Carrinho</span>
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-raspberry text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
