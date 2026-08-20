import logo from '../assets/logo-cone-royale.jpg'
import { useState } from 'react'
import { CATEGORIES, MENU } from '../data/menu'
import ProductCard from '../components/ProductCard'
import cardapio from '../assets/cardapio-cone-royale.jpg'

export default function Menu() {
  const [active, setActive] = useState('tradicionais')
  const filtered = MENU.filter((p) => p.category === active)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main>
      
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-gold/10">
       <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
        <img
          src={logo}
           alt="Cone Royale"
            className="h-12 w-auto object-contain"
           />
       </div>
       </header>

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

      {/* Cardápio em imagem */}
      <section className="max-w-5xl mx-auto px-4 py-10" id="cardapio">
        <div className="text-center mb-5">
          <p className="text-orange font-semibold text-xs tracking-[0.3em] uppercase">Nosso cardápio</p>
          <h2 className="font-display text-4xl sm:text-5xl text-cream mt-1">Confira nossos sabores</h2>
          <p className="text-gray text-sm mt-2">Toque na imagem para abrir o cardápio em tamanho maior.</p>
        </div>

        <div className="w-full max-w-[200px] mx-auto">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="block w-full rounded-2xl overflow-hidden border border-gold/30 bg-charcoal shadow-[0_0_30px_rgba(245,197,24,0.12)] cursor-zoom-in transition-transform hover:scale-[1.01]"
            aria-label="Abrir cardápio em tamanho maior"
          >
            <img
              src={cardapio}
              alt="Cardápio Cone Royale"
              className="w-full h-auto object-contain"
              loading="eager"
            />
          </button>

          <a
            href="https://wa.me/5561982377059?text=Ol%C3%A1!%20Vi%20o%20card%C3%A1pio%20da%20Cone%20Royale%20e%20quero%20fazer%20um%20pedido."
            target="_blank"
            rel="noreferrer"
            className="mt-5 w-[300px] mx-auto flex items-center justify-center rounded-full px-6 py-3 bg-gradient-to-r from-gold to-orange text-black font-bold uppercase tracking-wide shadow-[0_0_18px_rgba(245,197,24,0.25)] hover:scale-[1.01] transition-transform"
          >
            Pedir pelo WhatsApp
          </a>
        </div>
      </section>

      {/* Modal do cardápio */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center"
          onClick={() => setMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Cardápio Cone Royale em tamanho maior"
        >
          <div className="relative max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-gold text-black font-black text-xl shadow-lg cursor-pointer"
              aria-label="Fechar cardápio"
            >
              ×
            </button>
            <img
              src={cardapio}
              alt="Cardápio Cone Royale ampliado"
              className="max-h-[92vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

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
