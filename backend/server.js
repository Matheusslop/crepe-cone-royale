require('dotenv').config()
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { sql, initDb } = require('./db')

const app = express()
app.use(cors())
app.use(express.json({ limit: '8mb' })) // limite maior para acomodar imagens em base64

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'
const ALLOWED_CATEGORIES = ['tradicionais', 'especiais', 'premium', 'doces']

function slugify(str) {
  return String(str)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

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

// A senha do admin pode ter sido alterada e fica salva (com hash) na tabela
// admin_settings. Enquanto ninguém trocar a senha, usamos o valor de ADMIN_PASSWORD.
async function getAdminPasswordHash() {
  const rows = await sql`SELECT value FROM admin_settings WHERE key = 'password_hash'`
  return rows.length > 0 ? rows[0].value : null
}

async function checkAdminPassword(password) {
  const hash = await getAdminPasswordHash()
  if (hash) return bcrypt.compare(password || '', hash)
  return password === ADMIN_PASSWORD
}

// --- Admin auth ---
app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body
  try {
    const valid = await checkAdminPassword(password)
    if (!valid) return res.status(401).json({ error: 'Senha incorreta.' })
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' })
    res.json({ token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao autenticar.' })
  }
})

// --- Change admin password (admin only) ---
app.patch('/api/admin/password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!newPassword || String(newPassword).length < 4)
    return res.status(400).json({ error: 'A nova senha deve ter ao menos 4 caracteres.' })
  try {
    const valid = await checkAdminPassword(currentPassword)
    if (!valid) return res.status(401).json({ error: 'Senha atual incorreta.' })
    const newHash = await bcrypt.hash(String(newPassword), 10)
    await sql`
      INSERT INTO admin_settings (key, value) VALUES ('password_hash', ${newHash})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao alterar a senha.' })
  }
})

// --- Menu / products (public read) ---
app.get('/api/products', async (req, res) => {
  try {
    const rows = await sql`SELECT id, category, name, description, price, image FROM products ORDER BY "position" ASC`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar o cardápio.' })
  }
})

// --- Create menu item (admin only) ---
app.post('/api/admin/products', authMiddleware, async (req, res) => {
  const { name, category, description, price } = req.body
  if (!name || !String(name).trim()) return res.status(400).json({ error: 'Nome é obrigatório.' })
  if (!ALLOWED_CATEGORIES.includes(category)) return res.status(400).json({ error: 'Categoria inválida.' })
  const priceNum = Number(price)
  if (!Number.isFinite(priceNum) || priceNum <= 0) return res.status(400).json({ error: 'Preço inválido.' })
  try {
    let baseId = slugify(name) || 'item'
    let id = baseId
    let n = 2
    while ((await sql`SELECT 1 FROM products WHERE id = ${id}`).length > 0) {
      id = `${baseId}-${n}`
      n++
    }
    const posRows = await sql`SELECT COALESCE(MAX("position"), -1) + 1 AS next FROM products`
    await sql`
      INSERT INTO products (id, category, name, description, price, "position")
      VALUES (${id}, ${category}, ${String(name).trim()}, ${description ? String(description).trim() : null}, ${priceNum}, ${posRows[0].next})
    `
    res.status(201).json({ id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar o item.' })
  }
})

// --- Update menu item — nome, categoria, descrição e/ou preço (admin only) ---
app.patch('/api/admin/products/:id', authMiddleware, async (req, res) => {
  const { name, description, price, category } = req.body
  try {
    const rows = await sql`SELECT * FROM products WHERE id = ${req.params.id}`
    if (rows.length === 0) return res.status(404).json({ error: 'Item não encontrado.' })
    const current = rows[0]

    const newName = name !== undefined ? String(name).trim() : current.name
    if (!newName) return res.status(400).json({ error: 'Nome é obrigatório.' })

    const newCategory = category !== undefined ? category : current.category
    if (!ALLOWED_CATEGORIES.includes(newCategory)) return res.status(400).json({ error: 'Categoria inválida.' })

    const newDescription = description !== undefined ? String(description).trim() : current.description

    let newPrice = current.price
    if (price !== undefined) {
      const priceNum = Number(price)
      if (!Number.isFinite(priceNum) || priceNum <= 0) return res.status(400).json({ error: 'Preço inválido.' })
      newPrice = priceNum
    }

    await sql`
      UPDATE products SET name = ${newName}, description = ${newDescription}, category = ${newCategory}, price = ${newPrice}
      WHERE id = ${req.params.id}
    `
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar o item.' })
  }
})

// --- Delete menu item (admin only) ---
app.delete('/api/admin/products/:id', authMiddleware, async (req, res) => {
  try {
    const rows = await sql`DELETE FROM products WHERE id = ${req.params.id} RETURNING id`
    if (rows.length === 0) return res.status(404).json({ error: 'Item não encontrado.' })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao remover o item.' })
  }
})

// --- Update item image (admin only) — recebe uma data URL (base64) já comprimida pelo front-end ---
app.patch('/api/admin/products/:id/image', authMiddleware, async (req, res) => {
  const { image } = req.body
  if (!image || typeof image !== 'string' || !image.startsWith('data:image/'))
    return res.status(400).json({ error: 'Imagem inválida.' })
  if (image.length > 6 * 1024 * 1024)
    return res.status(400).json({ error: 'Imagem muito grande. Use um arquivo menor.' })
  try {
    const rows = await sql`UPDATE products SET image = ${image} WHERE id = ${req.params.id} RETURNING id`
    if (rows.length === 0) return res.status(404).json({ error: 'Item não encontrado.' })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao salvar a imagem.' })
  }
})

// --- Remove item image (admin only) ---
app.delete('/api/admin/products/:id/image', authMiddleware, async (req, res) => {
  try {
    const rows = await sql`UPDATE products SET image = NULL WHERE id = ${req.params.id} RETURNING id`
    if (rows.length === 0) return res.status(404).json({ error: 'Item não encontrado.' })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao remover a imagem.' })
  }
})

// --- Create order (public) ---
app.post('/api/orders', async (req, res) => {
  const { customerName, phone, fulfillmentType, address, paymentMethod, notes, items, total } = req.body
  if (!customerName || !phone || !fulfillmentType || !paymentMethod || !items || !Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'Dados do pedido incompletos.' })
  if (fulfillmentType === 'entrega' && !address)
    return res.status(400).json({ error: 'Endereço obrigatório para entrega.' })
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

// --- Public: get order status (for customer tracking) ---
app.get('/api/orders/:id/status', async (req, res) => {
  try {
    const rows = await sql`SELECT id, status, "customerName", "fulfillmentType", "createdAt" FROM orders WHERE id = ${req.params.id}`
    if (rows.length === 0) return res.status(404).json({ error: 'Pedido não encontrado.' })
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar pedido.' })
  }
})

// --- List all orders (admin only) ---
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
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Status inválido.' })
  try {
    const rows = await sql`UPDATE orders SET status = ${status} WHERE id = ${req.params.id} RETURNING id`
    if (rows.length === 0) return res.status(404).json({ error: 'Pedido não encontrado.' })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar pedido.' })
  }
})

// --- Delete order (admin only) ---
app.delete('/api/orders/:id', authMiddleware, async (req, res) => {
  try {
    const rows = await sql`DELETE FROM orders WHERE id = ${req.params.id} RETURNING id`
    if (rows.length === 0) return res.status(404).json({ error: 'Pedido não encontrado.' })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao apagar o pedido.' })
  }
})

app.get('/api/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 4000
initDb()
  .then(() => app.listen(PORT, () => console.log(`Cone Royale API rodando na porta ${PORT}`)))
  .catch((err) => { console.error('Erro ao iniciar banco:', err); process.exit(1) })
