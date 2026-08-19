import { useState } from 'react'
import { CATEGORIES, MENU } from '../data/menu'
import ProductCard from '../components/ProductCard'

export default function Menu() {
  const [active, setActive] = useState('tradicionais')
  const filtered = MENU.filter((p) => p.category === active)

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,197,24,0.12)_0%,_transparent_70%)]" />
        <div className="max-w-5xl mx-auto px-5 py-14 relative z-10 text-center">
          <p className="text-orange font-semibold text-sm tracking-[0.3em] uppercase mb-3">Delivery &amp; Retirada · (61) 98237-7059</p>
          <h1 className="font-display text-6xl sm:text-8xl text-cream leading-none tracking-wide">
            <span className="gold-shimmer">CONE</span>{' '}
            <span className="text-cream">ROYALE</span>
          </h1>
          <p className="text-orange font-bold tracking-widest text-sm mt-1 uppercase">Crepes no Cone</p>
          <p className="text-gray mt-4 text-base max-w-sm mx-auto">
            O crepe que conquista na primeira mordida.
            Massa leve e crocante, sabores irresistíveis, feito na hora com carinho.
          </p>
        </div>
        {/* Gold line divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      </section>

      {/* Category tabs */}
      <div className="sticky top-[57px] z-30 bg-black/95 backdrop-blur border-b border-gold/10">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                active === cat.id
                  ? 'cat-active shadow-[0_0_12px_rgba(245,197,24,0.4)]'
                  : 'text-gray border border-gold/20 hover:border-gold/50 hover:text-cream'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gold/10 mt-6 py-8 text-center">
        <p className="text-gray text-sm">📍 Feito na hora com carinho &nbsp;·&nbsp; 📱 @crepeconeroyale</p>
        <p className="text-gold/60 text-xs mt-1">© 2026 Cone Royale</p>
      </footer>
    </main>
  )
}
