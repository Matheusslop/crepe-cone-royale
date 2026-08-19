import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../lib/api'

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token } = await adminLogin(password)
      onLogin(token)
      navigate('/admin/pedidos')
    } catch {
      setError('Senha incorreta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-sm mx-auto px-5 py-24 text-center">
      <span className="text-5xl">👑</span>
      <h1 className="font-display text-4xl text-gold mt-3 tracking-wide">ÁREA ADMIN</h1>
      <p className="text-gray text-sm mt-1 mb-8">Cone Royale · Gestão de pedidos</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Senha de acesso"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-black/40 text-cream placeholder:text-gray focus:border-gold outline-none"
          autoFocus
        />
        {error && <p className="text-red text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-gold text-black font-bold hover:bg-gold-light transition-colors disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'ENTRANDO...' : 'ENTRAR'}
        </button>
      </form>
    </main>
  )
}
