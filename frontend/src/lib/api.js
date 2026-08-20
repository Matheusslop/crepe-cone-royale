const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function createOrder(order) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Não foi possível enviar o pedido.')
  }
  return res.json()
}

export async function getOrderStatus(id) {
  const res = await fetch(`${API_BASE}/orders/${id}/status`)
  if (!res.ok) throw new Error('Pedido não encontrado.')
  return res.json()
}

export async function adminLogin(password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!res.ok) throw new Error('Senha incorreta.')
  return res.json()
}

export async function fetchOrders(token) {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Não foi possível carregar os pedidos.')
  return res.json()
}

export async function updateOrderStatus(token, id, status) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Não foi possível atualizar o pedido.')
  return res.json()
}
