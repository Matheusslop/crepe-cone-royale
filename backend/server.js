require('dotenv').config()
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { sql, initDb } = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Token ausente.' })
  try {
    jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido.' })
  }
}

// --- Admin auth ---
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta.' })
  }
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' })
  res.json({ token })
})

// --- Create order (public) ---
app.post('/api/orders', async (req, res) => {
  const { customerName, phone, fulfillmentType, address, paymentMethod, notes, items, total } = req.body

  if (!customerName || !phone || !fulfillmentType || !paymentMethod || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Dados do pedido incompletos.' })
  }
  if (fulfillmentType === 'entrega' && !address) {
    return res.status(400).json({ error: 'Endereço obrigatório para entrega.' })
  }

  try {
    const rows = await sql`
      INSERT INTO orders ("customerName", phone, "fulfillmentType", address, "paymentMethod", notes, items, total)
      VALUES (${customerName}, ${phone}, ${fulfillmentType}, ${address || null}, ${paymentMethod}, ${notes || null}, ${JSON.stringify(items)}, ${total})
      RETURNING id
    `
    res.status(201).json({ id: rows[0].id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao salvar o pedido.' })
  }
})

// --- List orders (admin only) ---
app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM orders ORDER BY id DESC`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar pedidos.' })
  }
})

// --- Update order status (admin only) ---
app.patch('/api/orders/:id', authMiddleware, async (req, res) => {
  const { status } = req.body
  const allowed = ['recebido', 'preparando', 'pronto', 'entregue', 'cancelado']
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' })
  }
  try {
    const rows = await sql`UPDATE orders SET status = ${status} WHERE id = ${req.params.id} RETURNING id`
    if (rows.length === 0) return res.status(404).json({ error: 'Pedido não encontrado.' })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar pedido.' })
  }
})

app.get('/api/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 4000

initDb()
  .then(() => app.listen(PORT, () => console.log(`Crepe Cone Royale API rodando na porta ${PORT}`)))
  .catch((err) => { console.error('Erro ao iniciar banco:', err); process.exit(1) })
