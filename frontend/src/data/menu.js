export const CATEGORIES = [
  { id: 'tradicionais', label: 'Tradicionais' },
  { id: 'especiais',    label: 'Especiais' },
  { id: 'premium',      label: 'Premium 👑' },
  { id: 'doces',        label: 'Doces' },
]

// Preço fixo de cada ingrediente extra que o cliente pode adicionar ao pedido.
export const EXTRA_PRICE = 3

// Ingredientes extras disponíveis, separados por tipo de cone (salgado ou doce).
export const EXTRAS = {
  salgado: [
    { id: 'extra-catupiry', name: 'Catupiry', price: EXTRA_PRICE },
    { id: 'extra-cheddar', name: 'Cheddar', price: EXTRA_PRICE },
    { id: 'extra-bacon', name: 'Bacon', price: EXTRA_PRICE },
    { id: 'extra-calabresa', name: 'Calabresa', price: EXTRA_PRICE },
    { id: 'extra-cebola-crispy', name: 'Cebola Crispy', price: EXTRA_PRICE },
    { id: 'extra-milho', name: 'Milho', price: EXTRA_PRICE },
  ],
  doce: [
    { id: 'extra-leite-condensado', name: 'Leite Condensado', price: EXTRA_PRICE },
    { id: 'extra-granola', name: 'Granola', price: EXTRA_PRICE },
    { id: 'extra-chocolate', name: 'Chocolate', price: EXTRA_PRICE },
    { id: 'extra-morango', name: 'Morango', price: EXTRA_PRICE },
    { id: 'extra-marshmallow', name: 'Marshmallow', price: EXTRA_PRICE },
  ],
}

export const MENU = [
  // TRADICIONAIS — R$19,50
  { id: 'trad-1', category: 'tradicionais', name: 'Cone Italiano',  description: 'Queijo mussarela, presunto, tomate e orégano.', price: 19.50 },
  { id: 'trad-2', category: 'tradicionais', name: 'Cone de Palmito', description: 'Queijo mussarela, palmito e ervas finas.', price: 19.50 },
  { id: 'trad-3', category: 'tradicionais', name: 'Cone Calabresa',  description: 'Queijo mussarela, tomate e calabresa.', price: 19.50 },

  // ESPECIAIS
  { id: 'esp-1', category: 'especiais', name: 'Queijo Premium',   description: 'Queijo mussarela, parmessão, provolone e catupiry.', price: 29.99 },
  { id: 'esp-2', category: 'especiais', name: 'Frango Cremoso',   description: 'Frango desfiado, catupiry e milho.', price: 28.99 },

  // CONE ROYALE PREMIUM
  { id: 'prem-1', category: 'premium', name: 'Costela BBQ',         description: 'Costela desfiada, cheddar, molho barbecue e cebola crispy.', price: 35.99 },
  { id: 'prem-2', category: 'premium', name: 'Cone Bacon Royale',   description: 'Bacon crocante, cheddar e mussarela.', price: 34.99 },
  { id: 'prem-3', category: 'premium', name: 'Cone Camarão Cremoso', description: 'Catupiry, queijo mussarela, camarão e alho poró.', price: 35.99 },

  // DOCES
  { id: 'doc-1', category: 'doces', name: 'Cone Sensação',          description: 'Chocolate, morango e queijo mussarela.', price: 29.99 },
  { id: 'doc-2', category: 'doces', name: 'Cone Banana Caramelizada', description: 'Banana, açúcar e canela.', price: 27.00 },
  { id: 'doc-3', category: 'doces', name: 'Cone Paris Sweet',        description: 'Morango, chocolate, leite condensado e castanha.', price: 34.99 },
  { id: 'doc-4', category: 'doces', name: 'Cone Banana Flambée',     description: 'Banana caramelizada, doce de leite e canela.', price: 32.99 },
]
