import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getOrderStatus } from '../lib/api'

const STEPS = [
  { key: 'recebido',   icon: '📋', label: 'Pedido recebido',  desc: 'Seu pedido chegou para a gente!' },
  { key: 'preparando', icon: '👨‍🍳', label: 'Preparando',       desc: 'Estamos fazendo seu cone agora.' },
  { key: 'pronto',     icon: '✅', label: 'Pronto!',           desc: 'Seu cone está pronto.' },
  { key: 'entregue',   icon: '🛵', label: 'A caminho / Entregue', desc: 'Bom apetite! 👑' },
]
const ORDER_INDEX = { recebido: 0, preparando: 1, pronto: 2, entregue: 3, cancelado: -1 }

export default function OrderConfirmation() {
  const { id } = useParams()
  const [status, setStatus] = useState('recebido')
  const [cancelled, setCancelled] = useState(false)
  const [loading, setLoading] = useState(true)

  async function fetchStatus() {
    try {
      const data = await getOrderStatus(id)
      if (data.status === 'cancelado') {
        setCancelled(true)
      } else {
        setStatus(data.status)
      }
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchStatus()
    const iv = setInterval(fetchStatus, 15000)
    return () => clearInterval(iv)
  }, [id])

  const currentIdx = ORDER_INDEX[status] ?? 0

  if (cancelled) {
    return (
      <main className="max-w-lg mx-auto px-5 py-20 text-center">
        <span className="text-5xl">❌</span>
        <h1 className="font-display text-4xl text-red mt-4">Pedido Cancelado</h1>
        <p className="text-gray mt-2">Seu pedido #{id} foi cancelado. Entre em contato pelo WhatsApp.</p>
        <a href="https://wa.me/5561982377059" className="inline-block mt-6 bg-gold text-black px-6 py-3 rounded-full font-bold hover:bg-gold-light">Falar no WhatsApp</a>
      </main>
    )
  }

  return (
    <main className="max-w-lg mx-auto px-5 py-14">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-5xl">👑</span>
        <h1 className="font-display text-5xl text-gold tracking-wide mt-3">PEDIDO #{id}</h1>
        <p className="text-gray mt-2 text-sm">Atualizando automaticamente a cada 15 segundos.</p>
      </div>

      {/* Status steps */}
      {loading ? (
        <p className="text-center text-gray">Carregando status...</p>
      ) : (
        <div className="space-y-2">
          {STEPS.map((step, idx) => {
            const done   = idx < currentIdx
            const active = idx === currentIdx
            const wait   = idx > currentIdx

            return (
              <div
                key={step.key}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  active ? 'border-gold/60 bg-gold/10' : done ? 'border-gold/20 bg-charcoal' : 'border-gold/5 bg-charcoal/40 opacity-40'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 border-2 ${
                  done ? 'step-done' : active ? 'step-active' : 'step-wait'
                }`}>
                  {done ? '✓' : step.icon}
                </div>
                <div>
                  <p className={`font-semibold ${active ? 'text-gold' : done ? 'text-cream' : 'text-gray'}`}>{step.label}</p>
                  {active && <p className="text-sm text-orange mt-0.5">{step.desc}</p>}
                </div>
                {active && (
                  <span className="ml-auto inline-block w-2.5 h-2.5 bg-orange rounded-full animate-pulse" />
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-3">
        <a
          href="https://wa.me/5561982377059"
          target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-gold/30 text-gold font-semibold text-sm hover:bg-gold/10 transition-colors"
        >
          📱 Dúvidas? Fale no WhatsApp
        </a>
        <Link to="/" className="text-center text-gray text-sm hover:text-cream transition-colors">
          Fazer novo pedido
        </Link>
      </div>
    </main>
  )
}
