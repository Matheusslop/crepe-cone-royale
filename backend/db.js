const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'orders.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    phone TEXT NOT NULL,
    fulfillmentType TEXT NOT NULL,
    address TEXT,
    paymentMethod TEXT NOT NULL,
    notes TEXT,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'recebido',
    createdAt TEXT NOT NULL
  )
`)

module.exports = db
