import { useEffect, useRef, useState } from 'react'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { CATEGORIES } from '../../data/menu'
import { fetchProducts, uploadProductImage, removeProductImage } from '../../lib/api'
import { fileToCompressedDataUrl } from '../../lib/image'

export default function AdminProducts({ token }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const fileInputs = useRef({})

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

  async function handleRemove(id) {
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
      <div className="mb-6">
        <h1 className="font-display text-4xl text-gold tracking-wide">CARDÁPIO</h1>
        <p className="text-gray text-sm">Envie ou troque a foto de cada item. As imagens são redimensionadas automaticamente.</p>
      </div>

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

                  <p className="font-bold text-cream text-sm">{p.name}</p>
                  <p className="text-gray text-xs mb-3 line-clamp-2">{p.description}</p>

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
                      <ImagePlus size={14} /> {p.image ? 'Trocar imagem' : 'Adicionar imagem'}
                    </button>
                    {p.image && (
                      <button
                        onClick={() => handleRemove(p.id)}
                        disabled={busyId === p.id}
                        className="flex items-center justify-center text-xs px-3 py-2 rounded-full border border-red/30 text-red hover:bg-red/10 cursor-pointer disabled:opacity-60"
                        aria-label="Remover imagem"
                      >
                        <X size={14} />
                      </button>
                    )}
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
