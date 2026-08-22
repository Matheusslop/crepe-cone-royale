import { useEffect, useRef, useState } from 'react'
import { ImagePlus, X, Loader2, Pencil, Check, Trash2, Plus } from 'lucide-react'
import { CATEGORIES } from '../../data/menu'
import {
  fetchProducts,
  uploadProductImage,
  removeProductImage,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../lib/api'
import { fileToCompressedDataUrl } from '../../lib/image'

const fmt = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const emptyForm = { name: '', category: CATEGORIES[0].id, description: '', price: '' }

export default function AdminProducts({ token }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const fileInputs = useRef({})

  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState(emptyForm)
  const [editError, setEditError] = useState('')

  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [savingForm, setSavingForm] = useState(false)

  async function load() {
    try {
      setProducts(await fetchProducts())
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // --- Novo item ---
  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')
    const priceNum = Number(form.price.replace(',', '.'))
    if (!form.name.trim()) { setFormError('Informe o nome do item.'); return }
    if (!Number.isFinite(priceNum) || priceNum <= 0) { setFormError('Informe um preço válido.'); return }

    setSavingForm(true)
    try {
      await createProduct(token, {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        price: priceNum,
      })
      setForm(emptyForm)
      setCreating(false)
      await load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSavingForm(false)
    }
  }

  // --- Editar item (nome, categoria, descrição e preço) ---
  function startEdit(p) {
    setEditingId(p.id)
    setEditError('')
    setEditDraft({
      name: p.name || '',
      category: p.category,
      description: p.description || '',
      price: String(p.price),
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditError('')
  }

  async function saveEdit(id) {
    setEditError('')
    const priceNum = Number(String(editDraft.price).replace(',', '.'))
    if (!editDraft.name.trim()) { setEditError('Informe o nome do item.'); return }
    if (!Number.isFinite(priceNum) || priceNum <= 0) { setEditError('Informe um preço válido.'); return }

    setBusyId(id)
    try {
      await updateProduct(token, id, {
        name: editDraft.name.trim(),
        category: editDraft.category,
        description: editDraft.description.trim(),
        price: priceNum,
      })
      setProducts((prev) => prev.map((p) => (p.id === id ? {
        ...p,
        name: editDraft.name.trim(),
        category: editDraft.category,
        description: editDraft.description.trim(),
        price: priceNum,
      } : p)))
      setEditingId(null)
    } catch (err) {
      setEditError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  // --- Remover item ---
  async function handleDeleteProduct(id, name) {
    if (!window.confirm(`Remover "${name}" do cardápio? Esta ação não pode ser desfeita.`)) return
    setBusyId(id)
    try {
      await deleteProduct(token, id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert(err.message)
    } finally {
      setBusyId(null)
    }
  }

  // --- Imagem ---
  async function handleFile(id, e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Selecione um arquivo de imagem.'); return }

    setBusyId(id)
    try {
      const dataUrl = await fileToCompressedDataUrl(file)
      await uploadProductImage(token, id, dataUrl)
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, image: dataUrl } : p)))
    } catch (err) {
      alert(err.message)
    } finally {
      setBusyId(null)
    }
  }

  async function handleRemoveImage(id) {
    if (!window.confirm('Remover a imagem deste item?')) return
    setBusyId(id)
    try {
      await removeProductImage(token, id)
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, image: null } : p)))
    } catch (err) {
      alert(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-4xl text-gold tracking-wide">CARDÁPIO</h1>
          <p className="text-gray text-sm">Adicione itens e edite nome, categoria, descrição, preço e foto.</p>
        </div>
        <button
          onClick={() => { setCreating((v) => !v); setFormError('') }}
          className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full bg-gold text-black font-semibold hover:bg-gold-light transition-colors cursor-pointer"
        >
          <Plus size={14} /> {creating ? 'Cancelar' : 'Novo item'}
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="bg-charcoal border border-gold/20 rounded-2xl p-5 mb-8 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nome do item *"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="px-4 py-2.5 rounded-xl border border-gold/20 bg-black/40 text-cream placeholder:text-gray focus:border-gold outline-none"
            />
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="px-4 py-2.5 rounded-xl border border-gold/20 bg-black/40 text-cream focus:border-gold outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Descrição (opcional)"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-black/40 text-cream placeholder:text-gray focus:border-gold outline-none resize-none"
          />
          <input
            type="text"
            inputMode="decimal"
            placeholder="Preço (ex: 29,90) *"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="w-full sm:w-48 px-4 py-2.5 rounded-xl border border-gold/20 bg-black/40 text-cream placeholder:text-gray focus:border-gold outline-none"
          />
          {formError && <p className="text-red text-sm">{formError}</p>}
          <button
            type="submit"
            disabled={savingForm}
            className="px-5 py-2.5 rounded-full bg-gold text-black font-bold text-sm hover:bg-gold-light transition-colors disabled:opacity-60 cursor-pointer"
          >
            {savingForm ? 'SALVANDO...' : 'ADICIONAR AO CARDÁPIO'}
          </button>
        </form>
      )}

      {loading && <p className="text-gray">Carregando...</p>}
      {error && <p className="text-red">{error}</p>}

      {CATEGORIES.map((cat) => {
        const items = products.filter((p) => p.category === cat.id)
        if (items.length === 0) return null
        return (
          <section key={cat.id} className="mb-8">
            <h2 className="text-gold font-semibold text-sm tracking-widest uppercase mb-3">{cat.label}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((p) => (
                <div key={p.id} className="bg-charcoal border border-gold/10 rounded-2xl p-4">
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black/40 border border-gold/10 mb-3 flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray text-xs">Sem imagem</span>
                    )}
                    {busyId === p.id && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 size={20} className="text-gold animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Item editável: nome, categoria, descrição e preço */}
                  {editingId === p.id ? (
                    <div className="space-y-2 mb-3">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Nome do item"
                        value={editDraft.name}
                        onChange={(e) => setEditDraft((f) => ({ ...f, name: e.target.value }))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gold/30 bg-black/50 text-cream text-sm font-bold outline-none focus:border-gold"
                      />
                      <select
                        value={editDraft.category}
                        onChange={(e) => setEditDraft((f) => ({ ...f, category: e.target.value }))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gold/30 bg-black/50 text-cream text-xs outline-none focus:border-gold"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                      <textarea
                        placeholder="Descrição (opcional)"
                        value={editDraft.description}
                        onChange={(e) => setEditDraft((f) => ({ ...f, description: e.target.value }))}
                        rows={2}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gold/30 bg-black/50 text-cream text-xs outline-none focus:border-gold resize-none"
                      />
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Preço"
                        value={editDraft.price}
                        onChange={(e) => setEditDraft((f) => ({ ...f, price: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(p.id)}
                        className="w-24 px-2.5 py-1.5 rounded-lg border border-gold/30 bg-black/50 text-cream text-sm outline-none focus:border-gold"
                      />
                      {editError && <p className="text-red text-xs">{editError}</p>}
                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          onClick={() => saveEdit(p.id)}
                          disabled={busyId === p.id}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-gold text-black font-semibold hover:bg-gold-light transition-colors disabled:opacity-60 cursor-pointer"
                        >
                          <Check size={13} /> Salvar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-gold/20 text-gray hover:text-cream cursor-pointer"
                        >
                          <X size={13} /> Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(p)}
                      className="w-full text-left mb-3 group cursor-pointer"
                    >
                      <p className="font-bold text-cream text-sm flex items-center gap-1.5">
                        {p.name} <Pencil size={11} className="opacity-0 group-hover:opacity-100 text-gold transition-opacity" />
                      </p>
                      <p className="text-gray text-xs mb-1.5 line-clamp-2">{p.description || 'Sem descrição'}</p>
                      <p className="text-gold font-bold text-sm">{fmt(p.price)}</p>
                    </button>
                  )}

                  <input
                    ref={(el) => (fileInputs.current[p.id] = el)}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(p.id, e)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => fileInputs.current[p.id]?.click()}
                      disabled={busyId === p.id}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-full bg-gold text-black font-semibold hover:bg-gold-light transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      <ImagePlus size={14} /> {p.image ? 'Trocar' : 'Imagem'}
                    </button>
                    {p.image && (
                      <button
                        onClick={() => handleRemoveImage(p.id)}
                        disabled={busyId === p.id}
                        className="flex items-center justify-center text-xs px-2.5 py-2 rounded-full border border-gold/20 text-gray hover:text-cream hover:border-gold/40 cursor-pointer disabled:opacity-60"
                        aria-label="Remover imagem"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      disabled={busyId === p.id}
                      className="flex items-center justify-center text-xs px-2.5 py-2 rounded-full border border-red/30 text-red hover:bg-red/10 cursor-pointer disabled:opacity-60"
                      aria-label="Remover item do cardápio"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
