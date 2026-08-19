import { useParams, Link } from 'react-router-dom'

export default function OrderConfirmation() {
  const { id } = useParams()

  return (
    <main className="max-w-lg mx-auto px-5 py-16 text-center">
      <span className="text-6xl">👑</span>
      <h1 className="font-display text-5xl text-gold tracking-wide mt-4">PEDIDO CONFIRMADO!</h1>
      <p className="text-gray mt-3 text-base">
        Seu pedido foi recebido e já está na fila da cozinha.
      </p>

      {/* Order number highlight */}
      <div className="my-8 bg-charcoal border border-gold/30 rounded-2xl py-6 px-8">
        <p className="text-gray text-sm uppercase tracking-widest mb-1">Número do pedido</p>
        <p className="font-display text-7xl text-gold tracking-wider">#{id}</p>
        <p className="text-gray text-xs mt-2">Guarde esse número para acompanhar o status</p>
      </div>

      {/* CTA: track order */}
      <Link
        to="/acompanhar"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-gold text-black font-bold text-sm hover:bg-gold-light transition-colors mb-3"
      >
        🔍 Acompanhar meu pedido
      </Link>

      <a
        href="https://wa.me/5561982377059"
        target="_blank" rel="noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-gold/30 text-gold text-sm font-semibold hover:bg-gold/10 transition-colors mb-3"
      >
        📱 Dúvidas? WhatsApp (61) 98237-7059
      </a>

      <Link to="/" className="text-gray text-sm hover:text-cream transition-colors">
        Fazer novo pedido
      </Link>
    </main>
  )
}
