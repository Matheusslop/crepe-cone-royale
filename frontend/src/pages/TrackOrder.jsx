import { useState } from 'react'
import { getOrderStatus } from '../lib/api'

const STEPS = [
  { key: 'recebido',   icon: '📋', label: 'Pedido recebido',      desc: 'Seu pedido chegou pra gente!' },
  { key: 'preparando', icon: '👨‍🍳', label: 'Preparando',            desc: 'Estamos fazendo seu cone agora.' },
  { key: 'pronto',     icon: '✅', label: 'Pronto!',               desc: 'Seu cone está pronto.' },
  { key: 'entregue',   icon: '🛵', label: 'A caminho / Entregue',  desc: 'Bom apetite! 👑' },
]
const ORDER_INDEX = { recebido: 0, preparando: 1, pronto: 2, entregue: 3, cancelado: -1 }

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    if (!orderId.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const data = await getOrderStatus(orderId.trim())
      setOrder(data)
    } catch {
      setError('Pedido não encontrado. Verifique o número e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRefresh() {
    if (!order) return
    setLoading(true)
    try {
      const data = await getOrderStatus(order.id)
      setOrder(data)
    } catch {}
    finally { setLoading(false) }
  }

  const currentIdx = order ? (ORDER_INDEX[order.status] ?? 0) : -1
  const cancelled  = order?.status === 'cancelado'

  return (
    <main className="max-w-lg mx-auto px-5 py-14">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-5xl">🔍</span>
        <h1 className="font-display text-5xl text-gold tracking-wide mt-3">ACOMPANHAR PEDIDO</h1>
        <p className="text-gray text-sm mt-2">Digite o número do seu pedido para ver o status em tempo real.</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="number"
          placeholder="Número do pedido (ex: 42)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-gold/20 bg-black/40 text-cream placeholder:text-gray focus:border-gold outline-none text-center text-lg font-semibold"
          min="1"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-gold text-black font-bold hover:bg-gold-light transition-colors disabled:opacity-60 cursor-pointer"
        >
          {loading ? '...' : 'Buscar'}
        </button>
      </form>

      {error && (
        <p className="text-center text-red text-sm mb-6">{error}</p>
      )}

      {/* Result */}
      {order && (
        <div>
          {/* Order info */}
          <div className="bg-charcoal border border-gold/20 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-gold font-bold font-display text-xl tracking-wide">PEDIDO #{order.id}</p>
              <p className="text-gray text-sm mt-0.5">{order.customerName}</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="text-xs text-gold border border-gold/30 px-3 py-1.5 rounded-full hover:bg-gold/10 cursor-pointer disabled:opacity-50 transition-colors"
            >
              {loading ? '...' : '↻ Atualizar'}
            </button>
          </div>

          {/* Cancelled state */}
          {cancelled ? (
            <div className="text-center py-8">
              <span className="text-5xl">❌</span>
              <p className="font-display text-3xl text-red mt-3 tracking-wide">PEDIDO CANCELADO</p>
              <p className="text-gray text-sm mt-2">Entre em contato pelo WhatsApp para mais informações.</p>
              <a
                href="https://wa.me/5561982377059"
                target="_blank" rel="noreferrer"
                className="inline-block mt-5 bg-gold text-black font-bold px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
              >
                📱 Falar no WhatsApp
              </a>
            </div>
          ) : (
            /* Status steps */
            <div className="space-y-3">
              {STEPS.map((step, idx) => {
                const done   = idx < currentIdx
                const active = idx === currentIdx
                return (
                  <div
                    key={step.key}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      active ? 'border-gold/60 bg-gold/10'
                             : done  ? 'border-gold/20 bg-charcoal'
                                     : 'border-gold/5 bg-charcoal/40 opacity-40'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 border-2 font-bold ${
                      done   ? 'step-done'
                             : active ? 'step-active'
                                      : 'step-wait'
                    }`}>
                      {done ? '✓' : step.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${active ? 'text-gold' : done ? 'text-cream' : 'text-gray'}`}>
                        {step.label}
                      </p>
                      {active && <p className="text-sm text-orange mt-0.5">{step.desc}</p>}
                    </div>
                    {active && (
                      <span className="w-2.5 h-2.5 bg-orange rounded-full animate-pulse flex-shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {!cancelled && (
            <p className="text-center text-gray text-xs mt-6">
              Atualize manualmente para ver o status mais recente.
            </p>
          )}

          <a
            href="https://wa.me/5561982377059"
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full mt-6 py-3 rounded-full border border-gold/30 text-gold text-sm font-semibold hover:bg-gold/10 transition-colors"
          >
            📱 Dúvidas? Fale no WhatsApp
          </a>
        </div>
      )}
    </main>
  )
}
