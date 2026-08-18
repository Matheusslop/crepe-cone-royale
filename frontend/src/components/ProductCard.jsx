import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'

const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="group relative bg-white/60 border border-wine/10 rounded-2xl p-5 flex flex-col justify-between hover:border-caramel/60 hover:shadow-[0_4px_20px_-4px_rgba(91,35,51,0.15)] transition-all">
      <div>
        <h3 className="font-display italic text-xl text-wine">{product.name}</h3>
        <p className="text-sm text-ink/70 mt-1.5 leading-relaxed">{product.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-semibold text-lg text-wine">{fmt(product.price)}</span>
        <button
          onClick={handleAdd}
          aria-label={`Adicionar ${product.name} ao carrinho`}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            added ? 'bg-raspberry text-white' : 'bg-caramel text-wine-dark hover:bg-caramel-light'
          }`}
        >
          <Plus size={16} />
          {added ? 'Adicionado' : 'Adicionar'}
        </button>
      </div>
    </div>
  )
}
