const { neon } = require('@neondatabase/serverless')

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não configurado. Adicione a variável de ambiente com a connection string do Neon.')
}

const sql = neon(process.env.DATABASE_URL)

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
  console.log('Banco de dados pronto.')
}

module.exports = { sql, initDb }
