import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function CartDrawer({ open, onClose }) {
  const { items, updateQty, removeItem, total } = useCart()

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/70 z-50 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-charcoal z-50 shadow-2xl transition-transform flex flex-col border-l border-gold/20 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Carrinho"
      >
        <div className="flex items-center justify-between p-5 border-b border-gold/20">
          <h2 className="font-display text-2xl text-gold tracking-wide">SEU PEDIDO</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gold/10 cursor-pointer text-cream">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 && (
            <p className="text-gray text-sm">Seu carrinho está vazio. Que tal um Cone Royale Premium? 👑</p>
          )}
          {items.map((item) => (
            <div key={item.lineId} className="bg-black/40 rounded-xl p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-cream text-sm">{item.name}</p>
                  {item.extras?.length > 0 && (
                    <p className="text-xs text-orange mt-0.5">+ {item.extras.map((e) => e.name).join(', ')}</p>
                  )}
                  {item.notes && <p className="text-xs text-gray mt-0.5">{item.notes}</p>}
                  <p className="text-gold font-bold mt-1">{fmt(item.price)}</p>
                </div>
                <button onClick={() => removeItem(item.lineId)} className="text-gray hover:text-red cursor-pointer">
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => updateQty(item.lineId, item.qty - 1)} className="w-7 h-7 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold/10 cursor-pointer text-cream">
                  <Minus size={13} />
                </button>
                <span className="w-4 text-center text-cream font-semibold">{item.qty}</span>
                <button onClick={() => updateQty(item.lineId, item.qty + 1)} className="w-7 h-7 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold/10 cursor-pointer text-cream">
                  <Plus size={13} />
                </button>
                <span className="ml-auto text-sm text-gray">{fmt(item.price * item.qty)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-gold/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray">Total</span>
            <span className="font-display text-3xl text-gold tracking-wide">{fmt(total)}</span>
          </div>
          <Link
            to="/finalizar"
            onClick={onClose}
            className={`block text-center w-full py-3.5 rounded-full font-bold text-sm transition-colors ${
              items.length === 0
                ? 'bg-gold/20 text-gold/40 pointer-events-none'
                : 'bg-gold text-black hover:bg-gold-light'
            }`}
          >
            FINALIZAR PEDIDO
          </Link>
        </div>
      </aside>
    </>
  )
}
