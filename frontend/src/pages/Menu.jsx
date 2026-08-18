import { useState } from 'react'
import { CATEGORIES, MENU } from '../data/menu'
import ProductCard from '../components/ProductCard'
import FoldDivider from '../components/FoldDivider'

export default function Menu() {
  const [active, setActive] = useState('salgados')
  const filtered = MENU.filter((p) => p.category === active)

  return (
    <main>
      <section className="max-w-5xl mx-auto px-5 pt-12 pb-8">
        <p className="text-raspberry font-medium text-sm tracking-wide uppercase">Feitos na chapa, na hora do pedido</p>
        <h1 className="font-display italic text-5xl sm:text-6xl text-wine mt-2 leading-[1.05]">
          Crepe dobrado na<br />hora certa.
        </h1>
        <p className="text-ink/70 mt-4 max-w-md">
          Massa fina, recheio generoso e aquele dobro perfeito. Escolha seus crepes,
          monte o pedido e receba em casa ou retire quentinho.
        </p>
      </section>

      <FoldDivider color="#5B2333" />

      <section className="bg-wine">
        <div className="max-w-5xl mx-auto px-5 py-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                active === cat.id ? 'bg-caramel text-wine-dark' : 'text-batter/80 hover:text-batter'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <FoldDivider color="#5B2333" flip />

      <section className="max-w-5xl mx-auto px-5 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}
