# Crepe Cone Royale — Site de Vendas

Site completo para pedidos de crepes, com cardápio, carrinho, checkout com
formas de pagamento (Pix, cartão, dinheiro) e painel administrativo para
gerenciar os pedidos.

## Estrutura

```
crepe-cone-royale/
├── frontend/   → React + Vite + Tailwind (cardápio, carrinho, checkout)
└── backend/    → Node + Express + SQLite (API de pedidos e login admin)
```

## Rodando localmente

### 1. Backend (API)
```bash
cd backend
npm install
cp .env.example .env   # edite ADMIN_PASSWORD e JWT_SECRET
npm start
```
A API sobe em `http://localhost:4000`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Abre em `http://localhost:5173` (o Vite já faz proxy de `/api` para o backend).

## Acesso ao painel administrativo

Acesse `/admin` no site, digite a senha definida em `ADMIN_PASSWORD`
(arquivo `.env` do backend) e você verá todos os pedidos em `/admin/pedidos`,
podendo mudar o status: Recebido → Preparando → Pronto → Entregue (ou Cancelar).
A lista atualiza sozinha a cada 20 segundos, e também tem um botão de atualizar manual.

**Senha padrão de desenvolvimento:** `royale2026` (troque antes de publicar!)

## Como funciona o pagamento

Não há gateway de pagamento real integrado (nenhuma cobrança é processada
automaticamente). O cliente escolhe entre Pix, Cartão ou Dinheiro no checkout,
e essa escolha fica salva no pedido para você combinar o pagamento diretamente
com o cliente (ex: enviar a chave Pix por WhatsApp, levar a maquininha na
entrega). Se no futuro você quiser cobrança automática (ex: Mercado Pago,
Stripe), dá pra integrar depois.

## Publicando o site (deploy)

Sugestão simples e gratuita, seguindo o mesmo padrão dos seus outros projetos:

**Backend → Render**
1. Suba a pasta `backend/` para um repositório no GitHub.
2. No Render, crie um "Web Service" apontando pra esse repositório.
3. Build command: `npm install` — Start command: `node server.js`
4. Configure as variáveis de ambiente `ADMIN_PASSWORD` e `JWT_SECRET` no painel do Render (não suba o `.env` de produção).
   Atenção: o SQLite (`orders.db`) fica no disco do serviço — no plano gratuito do Render o disco é temporário e os pedidos podem ser perdidos em reinícios. Para produção séria, vale considerar um disco persistente pago ou trocar para Postgres.

**Frontend → Vercel ou Netlify**
1. Suba a pasta `frontend/` para o GitHub.
2. Importe o projeto na Vercel/Netlify (framework: Vite).
3. Configure a variável de build para apontar `/api` para a URL do backend no Render (ajuste o `vite.config.js` ou use uma variável de ambiente `VITE_API_URL`).

Se quiser, posso te ajudar a configurar isso passo a passo quando for publicar.
