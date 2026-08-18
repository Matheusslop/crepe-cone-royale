import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function CartDrawer({ open, onClose }) {
  const { items, updateQty, removeItem, total } = useCart()

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink/40 z-50 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-batter z-50 shadow-2xl transition-transform flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Carrinho de compras"
      >
        <div className="flex items-center justify-between p-5 border-b border-wine/10">
          <h2 className="font-display italic text-2xl text-wine">Seu carrinho</h2>
          <button onClick={onClose} aria-label="Fechar carrinho" className="p-1.5 rounded-full hover:bg-wine/10 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 && (
            <p className="text-ink/60 text-sm">Seu carrinho está vazio. Que tal um crepe de Nutella com morango?</p>
          )}
          {items.map((item) => (
            <div key={`${item.id}-${item.notes}`} className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium text-wine">{item.name}</p>
                {item.notes && <p className="text-xs text-ink/60 mt-0.5">{item.notes}</p>}
                <p className="text-sm text-ink/70 mt-1">{fmt(item.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQty(item.id, item.notes, item.qty - 1)}
                    className="w-7 h-7 rounded-full border border-wine/20 flex items-center justify-center hover:bg-wine/10 cursor-pointer"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center text-sm">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.notes, item.qty + 1)}
                    className="w-7 h-7 rounded-full border border-wine/20 flex items-center justify-center hover:bg-wine/10 cursor-pointer"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => removeItem(item.id, item.notes)}
                    className="ml-auto text-raspberry hover:text-wine-dark cursor-pointer"
                    aria-label={`Remover ${item.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-wine/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-ink/70">Total</span>
            <span className="font-display italic text-2xl text-wine">{fmt(total)}</span>
          </div>
          <Link
            to="/finalizar"
            onClick={onClose}
            className={`block text-center w-full py-3 rounded-full font-medium transition-colors ${
              items.length === 0
                ? 'bg-wine/20 text-wine/50 pointer-events-none'
                : 'bg-wine text-batter hover:bg-wine-dark'
            }`}
          >
            Finalizar pedido
          </Link>
        </div>
      </aside>
    </>
  )
}
