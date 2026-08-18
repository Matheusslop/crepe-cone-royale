# Crepe Cone Royale — Site de Vendas

Site completo para pedidos de crepes, com cardápio, carrinho, checkout
(Pix, cartão, dinheiro) e painel administrativo para gerenciar pedidos.
Banco de dados: **Neon (Postgres)**.

## Estrutura

```
crepe-cone-royale/
├── frontend/   → React + Vite + Tailwind
└── backend/    → Node + Express + Neon (Postgres)
```

## Rodando localmente

### 1. Crie o banco no Neon
1. Acesse neon.tech e crie uma conta (gratuito).
2. Crie um projeto e copie a **connection string** (começa com `postgresql://...`).

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# edite .env e cole DATABASE_URL, ADMIN_PASSWORD e JWT_SECRET
node server.js
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Abre em `http://localhost:5173`. Painel admin em `/admin`.
**Senha padrão de dev:** defina em `ADMIN_PASSWORD` no `.env`.

## Deploy no Render

### Backend → Web Service
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Variáveis de ambiente:
  - `DATABASE_URL` → connection string do Neon
  - `ADMIN_PASSWORD` → sua senha do painel admin
  - `JWT_SECRET` → string longa e aleatória

### Frontend → Static Site
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Variável de ambiente:
  - `VITE_API_URL` → URL do backend + `/api`
    ex: `https://crepe-cone-royale-api.onrender.com/api`
