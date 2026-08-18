import { createContext, useContext, useMemo, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([]) // { id, name, price, qty, notes }

  const addItem = useCallback((product, qty = 1, notes = '') => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.notes === notes)
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty, notes }]
    })
  }, [])

  const removeItem = useCallback((id, notes) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.notes === notes)))
  }, [])

  const updateQty = useCallback((id, notes, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => !(i.id === id && i.notes === notes))
        : prev.map((i) => (i.id === id && i.notes === notes ? { ...i, qty } : i))
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
