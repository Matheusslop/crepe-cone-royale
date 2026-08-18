import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, LogOut } from 'lucide-react'
import { fetchOrders, updateOrderStatus } from '../lib/api'

const fmt = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtDate = (iso) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

const STATUS_FLOW = ['recebido', 'preparando', 'pronto', 'entregue']
const STATUS_LABEL = {
  recebido: 'Recebido',
  preparando: 'Preparando',
  pronto: 'Pronto',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}
const STATUS_COLOR = {
  recebido: 'bg-caramel/30 text-wine-dark',
  preparando: 'bg-caramel text-wine-dark',
  pronto: 'bg-raspberry/80 text-white',
  entregue: 'bg-wine text-batter',
  cancelado: 'bg-ink/20 text-ink/70',
}
const PAYMENT_LABEL = { pix: 'Pix', cartao: 'Cartão', dinheiro: 'Dinheiro' }

export default function AdminDashboard({ token, onLogout }) {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const load = useCallback(async () => {
    try {
      const data = await fetchOrders(token)
      setOrders(data)
      setError('')
    } catch (err) {
      setError(err.message)
      if (String(err.message).includes('token') || err.status === 401) {
        onLogout()
        navigate('/admin')
      }
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!token) {
      navigate('/admin')
      return
    }
    load()
    const interval = setInterval(load, 20000)
    return () => clearInterval(interval)
  }, [token, load, navigate])

  async function handleStatusChange(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    try {
      await updateOrderStatus(token, id, status)
    } catch {
      load()
    }
  }

  const filtered = filter === 'todos' ? orders : orders.filter((o) => o.status === filter)

  return (
    <main className="max-w-4xl mx-auto px-5 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display italic text-4xl text-wine">Pedidos</h1>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 rounded-full hover:bg-wine/10 cursor-pointer" aria-label="Atualizar">
            <RefreshCw size={18} className="text-wine" />
          </button>
          <button
            onClick={() => { onLogout(); navigate('/admin') }}
            className="flex items-center gap-1.5 text-sm text-wine/70 hover:text-wine cursor-pointer"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['todos', ...STATUS_FLOW, 'cancelado'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
              filter === s ? 'bg-wine text-batter' : 'bg-white/60 text-wine border border-wine/15 hover:bg-wine/10'
            }`}
          >
            {s === 'todos' ? 'Todos' : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {loading && <p className="text-ink/60">Carregando pedidos...</p>}
      {error && <p className="text-raspberry">{error}</p>}
      {!loading && filtered.length === 0 && <p className="text-ink/60">Nenhum pedido nessa categoria.</p>}

      <div className="space-y-4">
        {filtered.map((order) => (
          <div key={order.id} className="bg-white/60 border border-wine/10 rounded-2xl p-5">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <p className="font-semibold text-wine">#{order.id} · {order.customerName}</p>
                <p className="text-sm text-ink/60">{order.phone} · {fmtDate(order.createdAt)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[order.status]}`}>
                {STATUS_LABEL[order.status]}
              </span>
            </div>

            <div className="mt-3 text-sm text-ink/80 space-y-0.5">
              {order.items.map((item, i) => (
                <p key={i}>{item.qty}x {item.name}</p>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/70">
              <span className="capitalize">{order.fulfillmentType === 'entrega' ? 'Entrega' : 'Retirada'}</span>
              <span>{PAYMENT_LABEL[order.paymentMethod]}</span>
              <span className="font-semibold text-wine">{fmt(order.total)}</span>
            </div>
            {order.address && <p className="text-sm text-ink/60 mt-1">{order.address}</p>}
            {order.notes && <p className="text-sm text-ink/60 mt-1 italic">Obs: {order.notes}</p>}

            <div className="flex flex-wrap gap-2 mt-4">
              {STATUS_FLOW.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(order.id, s)}
                  disabled={order.status === s}
                  className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                    order.status === s
                      ? 'bg-wine text-batter border-wine cursor-default'
                      : 'border-wine/20 text-wine hover:bg-wine/10'
                  }`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
              {order.status !== 'cancelado' && (
                <button
                  onClick={() => handleStatusChange(order.id, 'cancelado')}
                  className="text-xs px-3 py-1.5 rounded-full border border-raspberry/40 text-raspberry hover:bg-raspberry/10 cursor-pointer"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
