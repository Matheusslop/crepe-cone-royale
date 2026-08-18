import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../lib/api'

const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [fulfillment, setFulfillment] = useState('entrega')
  const [payment, setPayment] = useState('pix')
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (items.length === 0) return
    if (!form.name || !form.phone || (fulfillment === 'entrega' && !form.address)) {
      setError('Preencha os campos obrigatórios para continuar.')
      return
    }
    setLoading(true)
    try {
      const order = await createOrder({
        customerName: form.name,
        phone: form.phone,
        fulfillmentType: fulfillment,
        address: fulfillment === 'entrega' ? form.address : null,
        paymentMethod: payment,
        notes: form.notes,
        items,
        total,
      })
      clearCart()
      navigate(`/pedido/${order.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="max-w-lg mx-auto px-5 py-20 text-center">
        <h1 className="font-display italic text-3xl text-wine">Seu carrinho está vazio</h1>
        <p className="text-ink/70 mt-2">Volte ao cardápio para escolher seus crepes.</p>
        <Link to="/" className="inline-block mt-6 bg-wine text-batter px-6 py-3 rounded-full font-medium hover:bg-wine-dark">
          Ver cardápio
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-display italic text-4xl text-wine mb-6">Finalizar pedido</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset>
          <legend className="font-medium text-wine mb-2">Como você quer receber?</legend>
          <div className="flex gap-3">
            {[
              { id: 'entrega', label: 'Entrega' },
              { id: 'retirada', label: 'Retirada' },
            ].map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setFulfillment(opt.id)}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                  fulfillment === opt.id ? 'bg-wine text-batter border-wine' : 'border-wine/20 text-wine hover:bg-wine/5'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-medium text-wine mb-1">Seus dados</legend>
          <input
            type="text"
            placeholder="Nome completo"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-wine/20 bg-white/60 focus:border-caramel outline-none"
            required
          />
          <input
            type="tel"
            placeholder="Telefone / WhatsApp"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-wine/20 bg-white/60 focus:border-caramel outline-none"
            required
          />
          {fulfillment === 'entrega' && (
            <input
              type="text"
              placeholder="Endereço completo (rua, número, bairro)"
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-wine/20 bg-white/60 focus:border-caramel outline-none"
              required
            />
          )}
          <textarea
            placeholder="Observações (opcional)"
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-wine/20 bg-white/60 focus:border-caramel outline-none resize-none"
          />
        </fieldset>

        <fieldset>
          <legend className="font-medium text-wine mb-2">Forma de pagamento</legend>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'pix', label: 'Pix' },
              { id: 'cartao', label: 'Cartão' },
              { id: 'dinheiro', label: 'Dinheiro' },
            ].map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setPayment(opt.id)}
                className={`py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                  payment === opt.id ? 'bg-caramel border-caramel text-wine-dark' : 'border-wine/20 text-wine hover:bg-wine/5'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {payment === 'pix' && (
            <p className="text-xs text-ink/60 mt-2">A chave Pix é enviada por WhatsApp após a confirmação do pedido.</p>
          )}
          {payment === 'dinheiro' && (
            <p className="text-xs text-ink/60 mt-2">Pagamento em dinheiro no momento da entrega ou retirada.</p>
          )}
          {payment === 'cartao' && (
            <p className="text-xs text-ink/60 mt-2">Maquininha disponível na entrega, ou pagamento na retirada.</p>
          )}
        </fieldset>

        <div className="bg-white/60 rounded-xl p-4 space-y-1.5 border border-wine/10">
          {items.map((item) => (
            <div key={`${item.id}-${item.notes}`} className="flex justify-between text-sm text-ink/80">
              <span>{item.qty}x {item.name}</span>
              <span>{fmt(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold text-wine pt-2 mt-2 border-t border-wine/10">
            <span>Total</span>
            <span>{fmt(total)}</span>
          </div>
        </div>

        {error && <p className="text-raspberry text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-wine text-batter font-medium hover:bg-wine-dark transition-colors disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'Enviando pedido...' : `Confirmar pedido · ${fmt(total)}`}
        </button>
      </form>
    </main>
  )
}
