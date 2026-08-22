import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import Menu from './pages/Menu'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import TrackOrder from './pages/TrackOrder'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AdminPassword from './pages/admin/AdminPassword'

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') || '')

  function handleLogin(t) { setToken(t); sessionStorage.setItem('admin_token', t) }
  function handleLogout() { setToken(''); sessionStorage.removeItem('admin_token') }

  return (
    <CartProvider>
      <Routes>
        <Route path="/admin" element={<AdminLogin onLogin={handleLogin} />} />
        <Route
          path="/admin/*"
          element={
            token ? (
              <AdminLayout onLogout={handleLogout}>
                <Routes>
                  <Route path="pedidos" element={<AdminOrders token={token} onLogout={handleLogout} />} />
                  <Route path="cardapio" element={<AdminProducts token={token} />} />
                  <Route path="senha" element={<AdminPassword token={token} />} />
                  <Route path="*" element={<Navigate to="/admin/pedidos" replace />} />
                </Routes>
              </AdminLayout>
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />
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
                <Route path="/acompanhar" element={<TrackOrder />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </CartProvider>
  )
}
