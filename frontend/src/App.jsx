import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import Menu from './pages/Menu'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') || '')

  function handleLogin(t) {
    setToken(t)
    sessionStorage.setItem('admin_token', t)
  }
  function handleLogout() {
    setToken('')
    sessionStorage.removeItem('admin_token')
  }

  return (
    <CartProvider>
      <Routes>
        <Route path="/admin" element={<AdminLogin onLogin={handleLogin} />} />
        <Route path="/admin/pedidos" element={<AdminDashboard token={token} onLogout={handleLogout} />} />
        <Route
          path="*"
          element={
            <>
              <Header onOpenCart={() => setCartOpen(true)} />
              <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
              <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/finalizar" element={<Checkout />} />
                <Route path="/pedido/:id" element={<OrderConfirmation />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </CartProvider>
  )
}
