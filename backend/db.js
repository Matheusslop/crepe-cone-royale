const { neon } = require('@neondatabase/serverless')

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não configurado. Adicione a variável de ambiente com a connection string do Neon.')
}

const sql = neon(process.env.DATABASE_URL)

// Cardápio inicial usado para popular a tabela "products" na primeira execução.
const PRODUCTS_SEED = [
  { id: 'trad-1', category: 'tradicionais', name: 'Cone Italiano',  description: 'Queijo mussarela, presunto, tomate e orégano.', price: 19.50 },
  { id: 'trad-2', category: 'tradicionais', name: 'Cone de Palmito', description: 'Queijo mussarela, palmito e ervas finas.', price: 19.50 },
  { id: 'trad-3', category: 'tradicionais', name: 'Cone Calabresa',  description: 'Queijo mussarela, tomate e calabresa.', price: 19.50 },
  { id: 'esp-1', category: 'especiais', name: 'Queijo Premium',   description: 'Queijo mussarela, parmessão, provolone e catupiry.', price: 29.99 },
  { id: 'esp-2', category: 'especiais', name: 'Frango Cremoso',   description: 'Frango desfiado, catupiry e milho.', price: 28.99 },
  { id: 'prem-1', category: 'premium', name: 'Costela BBQ',         description: 'Costela desfiada, cheddar, molho barbecue e cebola crispy.', price: 35.99 },
  { id: 'prem-2', category: 'premium', name: 'Cone Bacon Royale',   description: 'Bacon crocante, cheddar e mussarela.', price: 34.99 },
  { id: 'prem-3', category: 'premium', name: 'Cone Camarão Cremoso', description: 'Catupiry, queijo mussarela, camarão e alho poró.', price: 35.99 },
  { id: 'doc-1', category: 'doces', name: 'Cone Sensação',          description: 'Chocolate, morango e queijo mussarela.', price: 29.99 },
  { id: 'doc-2', category: 'doces', name: 'Cone Banana Caramelizada', description: 'Banana, açúcar e canela.', price: 27.00 },
  { id: 'doc-3', category: 'doces', name: 'Cone Paris Sweet',        description: 'Morango, chocolate, leite condensado e castanha.', price: 34.99 },
  { id: 'doc-4', category: 'doces', name: 'Cone Banana Flambée',     description: 'Banana caramelizada, doce de leite e canela.', price: 32.99 },
]

async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      "customerName" TEXT NOT NULL,
      phone TEXT NOT NULL,
      "fulfillmentType" TEXT NOT NULL,
      address TEXT,
      "paymentMethod" TEXT NOT NULL,
      notes TEXT,
      items JSONB NOT NULL,
      total NUMERIC(10,2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'recebido',
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price NUMERIC(10,2) NOT NULL,
      image TEXT,
      "position" INTEGER NOT NULL DEFAULT 0
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `

  const existing = await sql`SELECT COUNT(*)::int AS count FROM products`
  if (existing[0].count === 0) {
    for (let i = 0; i < PRODUCTS_SEED.length; i++) {
      const p = PRODUCTS_SEED[i]
      await sql`
        INSERT INTO products (id, category, name, description, price, "position")
        VALUES (${p.id}, ${p.category}, ${p.name}, ${p.description}, ${p.price}, ${i})
        ON CONFLICT (id) DO NOTHING
      `
    }
  }

  console.log('Banco de dados pronto.')
}

module.exports = { sql, initDb }
