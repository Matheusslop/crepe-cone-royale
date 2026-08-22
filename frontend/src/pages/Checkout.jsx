import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../lib/api'

const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const inputCls = "w-full px-4 py-3 rounded-xl border border-gold/20 bg-black/40 text-cream placeholder:text-gray focus:border-gold focus:outline-none transition-colors"

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [fulfillment, setFulfillment] = useState('entrega')
  const [payment, setPayment] = useState('pix')
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function updateField(f, v) { setForm((p) => ({ ...p, [f]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.phone || (fulfillment === 'entrega' && !form.address)) {
      setError('Preencha os campos obrigatórios.')
      return
    }
    setLoading(true)
    try {
      const orderItems = items.map((i) => ({
        id: i.id,
        qty: i.qty,
        price: i.price,
        name: i.extras?.length ? `${i.name} (+ ${i.extras.map((e) => e.name).join(', ')})` : i.name,
      }))
      const order = await createOrder({ customerName: form.name, phone: form.phone, fulfillmentType: fulfillment, address: fulfillment === 'entrega' ? form.address : null, paymentMethod: payment, notes: form.notes, items: orderItems, total })
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
        <h1 className="font-display text-4xl text-gold">CARRINHO VAZIO</h1>
        <p className="text-gray mt-2">Volte ao cardápio e escolha seu cone.</p>
        <Link to="/" className="inline-block mt-6 bg-gold text-black px-6 py-3 rounded-full font-bold hover:bg-gold-light">Ver cardápio</Link>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-display text-5xl text-gold tracking-wide mb-8">FINALIZAR PEDIDO</h1>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Entrega / Retirada */}
        <fieldset>
          <legend className="text-cream font-semibold mb-2">Como quer receber?</legend>
          <div className="flex gap-3">
            {[{ id: 'entrega', label: '🛵 Entrega' }, { id: 'retirada', label: '🏪 Retirada' }].map((o) => (
              <button type="button" key={o.id} onClick={() => setFulfillment(o.id)}
                className={`flex-1 py-3 rounded-xl border font-semibold text-sm transition-colors cursor-pointer ${fulfillment === o.id ? 'bg-gold border-gold text-black' : 'border-gold/20 text-gray hover:border-gold/50'}`}>
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Dados */}
        <fieldset className="space-y-3">
          <legend className="text-cream font-semibold mb-1">Seus dados</legend>
          <input type="text" placeholder="Nome completo *" value={form.name} onChange={(e) => updateField('name', e.target.value)} className={inputCls} required />
          <input type="tel" placeholder="Telefone / WhatsApp *" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputCls} required />
          {fulfillment === 'entrega' && (
            <input type="text" placeholder="Endereço completo (rua, número, bairro) *" value={form.address} onChange={(e) => updateField('address', e.target.value)} className={inputCls} required />
          )}
          <textarea placeholder="Observações (opcional)" value={form.notes} onChange={(e) => updateField('notes', e.target.value)} rows={2} className={`${inputCls} resize-none`} />
        </fieldset>

        {/* Pagamento */}
        <fieldset>
          <legend className="text-cream font-semibold mb-2">Forma de pagamento</legend>
          <div className="grid grid-cols-3 gap-3">
            {[{ id: 'pix', label: '💠 Pix' }, { id: 'cartao', label: '💳 Cartão' }, { id: 'dinheiro', label: '💵 Dinheiro' }].map((o) => (
              <button type="button" key={o.id} onClick={() => setPayment(o.id)}
                className={`py-3 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${payment === o.id ? 'bg-gold border-gold text-black' : 'border-gold/20 text-gray hover:border-gold/50'}`}>
                {o.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray mt-2">
            {payment === 'pix' && 'Chave Pix enviada via WhatsApp após confirmação.'}
            {payment === 'cartao' && 'Maquininha disponível na entrega ou no balcão.'}
            {payment === 'dinheiro' && 'Pagamento em espécie na entrega ou retirada.'}
          </p>
        </fieldset>

        {/* Resumo */}
        <div className="bg-charcoal border border-gold/20 rounded-2xl p-4 space-y-1.5">
          {items.map((item) => (
            <div key={item.lineId} className="flex justify-between text-sm text-gray">
              <span>
                {item.qty}x {item.name}
                {item.extras?.length > 0 && (
                  <span className="text-orange"> (+ {item.extras.map((e) => e.name).join(', ')})</span>
                )}
              </span>
              <span>{fmt(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-gold pt-2 mt-2 border-t border-gold/20 text-lg">
            <span>Total</span><span>{fmt(total)}</span>
          </div>
        </div>

        {error && <p className="text-red text-sm">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-full bg-gold text-black font-bold text-sm hover:bg-gold-light transition-colors disabled:opacity-60 cursor-pointer tracking-wider">
          {loading ? 'ENVIANDO...' : `CONFIRMAR PEDIDO · ${fmt(total)}`}
        </button>
      </form>
    </main>
  )
}
