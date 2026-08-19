import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'

const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const CATEGORY_BADGE = {
  tradicionais: { label: 'Tradicional', cls: 'bg-charcoal text-gold border border-gold/30' },
  especiais:    { label: 'Especial',    cls: 'bg-orange/20 text-orange border border-orange/30' },
  premium:      { label: '👑 Premium',  cls: 'bg-gold/20 text-gold border border-gold/50' },
  doces:        { label: '♥ Doce',      cls: 'bg-red/20 text-red border border-red/30' },
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const badge = CATEGORY_BADGE[product.category] || {}

  function handleAdd() {
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div className="group bg-charcoal border border-gold/10 rounded-2xl p-5 flex flex-col justify-between hover:border-gold/40 hover:shadow-[0_0_20px_rgba(245,197,24,0.08)] transition-all">
      <div>
        {badge.label && (
          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 ${badge.cls}`}>
            {badge.label}
          </span>
        )}
        <h3 className="font-display text-xl text-cream tracking-wide">{product.name}</h3>
        <p className="text-sm text-gray mt-1.5 leading-relaxed">{product.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold text-xl text-gold">{fmt(product.price)}</span>
        <button
          onClick={handleAdd}
          aria-label={`Adicionar ${product.name}`}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
            added
              ? 'bg-green-600 text-white scale-95'
              : 'bg-gold text-black hover:bg-gold-light'
          }`}
        >
          {added ? <Check size={15} /> : <Plus size={15} />}
          {added ? 'Adicionado!' : 'Adicionar'}
        </button>
      </div>
    </div>
  )
}
