import { useState } from 'react'
import { changeAdminPassword } from '../../lib/api'

export default function AdminPassword({ token }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (next.length < 4) { setError('A nova senha deve ter ao menos 4 caracteres.'); return }
    if (next !== confirm) { setError('As senhas não coincidem.'); return }

    setLoading(true)
    try {
      await changeAdminPassword(token, current, next)
      setSuccess('Senha alterada com sucesso.')
      setCurrent('')
      setNext('')
      setConfirm('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-sm mx-auto px-5 py-12">
      <h1 className="font-display text-4xl text-gold tracking-wide mb-1">SENHA</h1>
      <p className="text-gray text-sm mb-8">Altere a senha de acesso ao painel administrativo.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Senha atual"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-black/40 text-cream placeholder:text-gray focus:border-gold outline-none"
        />
        <input
          type="password"
          placeholder="Nova senha"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-black/40 text-cream placeholder:text-gray focus:border-gold outline-none"
        />
        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-black/40 text-cream placeholder:text-gray focus:border-gold outline-none"
        />
        {error && <p className="text-red text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-gold text-black font-bold hover:bg-gold-light transition-colors disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'SALVANDO...' : 'SALVAR NOVA SENHA'}
        </button>
      </form>
    </main>
  )
}
