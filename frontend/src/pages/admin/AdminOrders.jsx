import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, Trash2 } from 'lucide-react'
import { fetchOrders, updateOrderStatus, deleteOrder } from '../../lib/api'

const fmt = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtDate = (iso) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

const STATUS_FLOW = ['recebido', 'preparando', 'pronto', 'entregue']
const STATUS_LABEL = { recebido: 'Recebido', preparando: 'Preparando', pronto: 'Pronto', entregue: 'Entregue', cancelado: 'Cancelado' }
const STATUS_COLOR = {
  recebido:   'bg-gold/20 text-gold border border-gold/40',
  preparando: 'bg-orange/20 text-orange border border-orange/40',
  pronto:     'bg-green-600/20 text-green-400 border border-green-500/40',
  entregue:   'bg-cream/10 text-cream border border-cream/20',
  cancelado:  'bg-red/10 text-red border border-red/30',
}
const PAYMENT_LABEL = { pix: '💠 Pix', cartao: '💳 Cartão', dinheiro: '💵 Dinheiro' }
const FULFILLMENT_LABEL = { entrega: '🛵 Entrega', retirada: '🏪 Retirada' }

export default function AdminOrders({ token, onLogout }) {
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
      if (String(err.message).includes('token')) { onLogout(); navigate('/admin') }
    } finally { setLoading(false) }
  }, [token])

  useEffect(() => {
    load()
    const iv = setInterval(load, 20000)
    return () => clearInterval(iv)
  }, [load])

  async function handleDelete(id) {
    if (!window.confirm(`Apagar permanentemente o pedido #${id}? Esta ação não pode ser desfeita.`)) return
    setOrders((prev) => prev.filter((o) => o.id !== id))
    try {
      await deleteOrder(token, id)
    } catch (err) {
      alert(err.message)
      load()
    }
  }

  async function handleStatus(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    try { await updateOrderStatus(token, id, status) } catch { load() }
  }

  const filtered = filter === 'todos' ? orders : orders.filter((o) => o.status === filter)
  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-gold tracking-wide">PEDIDOS</h1>
          <p className="text-gray text-sm">{orders.length} pedido{orders.length !== 1 ? 's' : ''} · atualiza em 20s</p>
        </div>
        <button onClick={load} className="p-2 rounded-full hover:bg-gold/10 cursor-pointer" aria-label="Atualizar">
          <RefreshCw size={18} className="text-gold" />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['todos', ...STATUS_FLOW, 'cancelado'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              filter === s ? 'bg-gold text-black' : 'bg-charcoal text-gray border border-gold/15 hover:border-gold/40'
            }`}>
            {s === 'todos' ? `Todos (${orders.length})` : `${STATUS_LABEL[s]} ${counts[s] ? `(${counts[s]})` : ''}`}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray">Carregando...</p>}
      {error && <p className="text-red">{error}</p>}
      {!loading && filtered.length === 0 && <p className="text-gray">Nenhum pedido nessa categoria.</p>}

      <div className="space-y-4">
        {filtered.map((order) => (
          <div key={order.id} className="bg-charcoal border border-gold/10 rounded-2xl p-5 hover:border-gold/25 transition-colors">
            <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
              <div>
                <p className="font-bold text-cream">#{order.id} · {order.customerName}</p>
                <p className="text-xs text-gray mt-0.5">{order.phone} · {fmtDate(order.createdAt)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[order.status]}`}>
                {STATUS_LABEL[order.status]}
              </span>
            </div>

            <div className="text-sm text-gray space-y-0.5 mb-3">
              {order.items.map((item, i) => (
                <p key={i} className="text-cream/80">{item.qty}x {item.name}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray mb-2">
              <span>{FULFILLMENT_LABEL[order.fulfillmentType]}</span>
              <span>{PAYMENT_LABEL[order.paymentMethod]}</span>
              <span className="font-bold text-gold text-sm">{fmt(order.total)}</span>
            </div>
            {order.address && <p className="text-xs text-gray mb-1">📍 {order.address}</p>}
            {order.notes && <p className="text-xs text-orange italic">Obs: {order.notes}</p>}

            {/* Status action buttons */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gold/10">
              {STATUS_FLOW.map((s) => (
                <button key={s} onClick={() => handleStatus(order.id, s)} disabled={order.status === s}
                  className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                    order.status === s
                      ? 'bg-gold text-black border-gold font-semibold'
                      : 'border-gold/20 text-gray hover:border-gold/50 hover:text-cream'
                  }`}>
                  {STATUS_LABEL[s]}
                </button>
              ))}
              {order.status !== 'cancelado' && (
                <button onClick={() => handleStatus(order.id, 'cancelado')}
                  className="text-xs px-3 py-1.5 rounded-full border border-red/30 text-red hover:bg-red/10 cursor-pointer ml-auto">
                  Cancelar
                </button>
              )}
              {order.status === 'cancelado' && (
                <button
                  onClick={() => handleDelete(order.id)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-red/30 text-red hover:bg-red/20 cursor-pointer ml-auto transition-colors"
                  title="Apagar pedido cancelado"
                >
                  <Trash2 size={13} /> Apagar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
