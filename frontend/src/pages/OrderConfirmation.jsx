import { useParams, Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

export default function OrderConfirmation() {
  const { id } = useParams()
  return (
    <main className="max-w-lg mx-auto px-5 py-20 text-center">
      <CheckCircle2 className="mx-auto text-raspberry" size={48} />
      <h1 className="font-display italic text-4xl text-wine mt-4">Pedido recebido!</h1>
      <p className="text-ink/70 mt-3">
        Seu pedido <span className="font-semibold text-wine">#{id}</span> foi enviado para a cozinha.
        Em instantes vamos confirmar por telefone.
      </p>
      <Link to="/" className="inline-block mt-8 bg-wine text-batter px-6 py-3 rounded-full font-medium hover:bg-wine-dark">
        Voltar ao cardápio
      </Link>
    </main>
  )
}
