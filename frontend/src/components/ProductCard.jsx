import { useState } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { EXTRAS, EXTRA_PRICE } from '../data/menu'

const fmt = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const CATEGORY_BADGE = {
  tradicionais: { label: 'Tradicional', cls: 'bg-charcoal text-gold border border-gold/30' },
  especiais:    { label: 'Especial',    cls: 'bg-orange/20 text-orange border border-orange/30' },
  premium:      { label: '👑 Premium',  cls: 'bg-gold/20 text-gold border border-gold/50' },
  doces:        { label: '♥ Doce',      cls: 'bg-red/20 text-red border border-red/30' },
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [selected, setSelected] = useState([])
  const [showImage, setShowImage] = useState(false)
  const badge = CATEGORY_BADGE[product.category] || {}
  const extrasList = EXTRAS[product.category === 'doces' ? 'doce' : 'salgado']
  const extrasTotal = selected.reduce((sum, e) => sum + e.price, 0)

  function toggleExtra(extra) {
    setSelected((prev) =>
      prev.some((e) => e.id === extra.id) ? prev.filter((e) => e.id !== extra.id) : [...prev, extra]
    )
  }

  function handleAdd() {
    addItem(product, 1, '', selected)
    setAdded(true)
    setCustomizing(false)
    setSelected([])
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div className="group bg-charcoal border border-gold/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-gold/40 hover:shadow-[0_0_20px_rgba(245,197,24,0.08)] transition-all">
      {product.image ? (
        <button
          type="button"
          onClick={() => setShowImage(true)}
          className="w-full h-40 cursor-zoom-in block"
          aria-label={`Ver foto de ${product.name} em tamanho completo`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover"
            loading="lazy"
          />
        </button>
      ) : (
        <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-charcoal to-black/60 text-3xl">
          🥐
        </div>
      )}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {badge.label && (
            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 ${badge.cls}`}>
              {badge.label}
            </span>
          )}
          <h3 className="font-display text-xl text-cream tracking-wide">{product.name}</h3>
          <p className="text-sm text-gray mt-1.5 leading-relaxed">{product.description}</p>

          {customizing && extrasList.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gold/10 space-y-1.5">
              <p className="text-[11px] text-gold font-semibold uppercase tracking-wide mb-1">
                Ingredientes extras (+{fmt(EXTRA_PRICE)} cada)
              </p>
              {extrasList.map((extra) => (
                <label key={extra.id} className="flex items-center gap-2 text-sm text-cream/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.some((e) => e.id === extra.id)}
                    onChange={() => toggleExtra(extra)}
                    className="accent-gold w-4 h-4"
                  />
                  {extra.name}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xl text-gold">{fmt(product.price + extrasTotal)}</span>
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
          {extrasList.length > 0 && (
            <button
              type="button"
              onClick={() => setCustomizing((v) => !v)}
              className="text-xs text-gray hover:text-gold mt-2 underline decoration-dotted cursor-pointer"
            >
              {customizing ? 'Ocultar ingredientes extras' : '+ Adicionar ingredientes (opcional)'}
            </button>
          )}
        </div>
      </div>

      {showImage && product.image && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setShowImage(false)}
        >
          <button
            type="button"
            onClick={() => setShowImage(false)}
            aria-label="Fechar"
            className="absolute top-4 right-4 text-cream/80 hover:text-gold bg-black/50 rounded-full p-2 cursor-pointer"
          >
            <X size={22} />
          </button>
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
