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

export async function deleteOrder(token, id) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Não foi possível apagar o pedido.')
  }
  return res.json()
}

export async function changeAdminPassword(token, currentPassword, newPassword) {
  const res = await fetch(`${API_BASE}/admin/password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Não foi possível alterar a senha.')
  }
  return res.json()
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`)
  if (!res.ok) throw new Error('Não foi possível carregar o cardápio.')
  return res.json()
}

export async function uploadProductImage(token, id, imageDataUrl) {
  const res = await fetch(`${API_BASE}/admin/products/${id}/image`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ image: imageDataUrl }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Não foi possível salvar a imagem.')
  }
  return res.json()
}

export async function removeProductImage(token, id) {
  const res = await fetch(`${API_BASE}/admin/products/${id}/image`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Não foi possível remover a imagem.')
  }
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
