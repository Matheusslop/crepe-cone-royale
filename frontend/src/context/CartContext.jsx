import { createContext, useContext, useMemo, useState, useCallback } from 'react'

const CartContext = createContext(null)

function buildLineId(id, notes, extras) {
  const extrasKey = extras.map((e) => e.id).sort().join(',')
  return `${id}|${notes}|${extrasKey}`
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]) // { lineId, id, name, price, basePrice, extras, qty, notes }

  const addItem = useCallback((product, qty = 1, notes = '', extras = []) => {
    const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0)
    const price = product.price + extrasTotal
    const lineId = buildLineId(product.id, notes, extras)
    setItems((prev) => {
      const existing = prev.find((i) => i.lineId === lineId)
      if (existing) {
        return prev.map((i) => (i.lineId === lineId ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { lineId, id: product.id, name: product.name, price, basePrice: product.price, extras, qty, notes }]
    })
  }, [])

  const removeItem = useCallback((lineId) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId))
  }, [])

  const updateQty = useCallback((lineId, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.lineId !== lineId)
        : prev.map((i) => (i.lineId === lineId ? { ...i, qty } : i))
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items])
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])

  const value = { items, addItem, removeItem, updateQty, clearCart, total, count }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart precisa estar dentro de um CartProvider')
  return ctx
}
