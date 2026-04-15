# 🏖️ Tá na Mão — Beach Kiosk App

Sistema completo de pedidos para quiosques de praia. Clientes fazem pedidos pelo celular, a cozinha acompanha em tempo real pelo painel KanBan, e o proprietário gerencia tudo pelo dashboard administrativo.

## Arquitetura

```
├── api/          → Backend Node.js (Express + Prisma + PostgreSQL)
├── dashboard/    → Painel Web do Proprietário (Vite + React)
├── mobile/       → App do Cliente (Expo + React Native)
├── scripts/      → Scripts utilitários (seed, admin, migrations)
└── docs/         → Documentação do projeto
```

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Mobile | React Native + Expo |
| Dashboard | React + Vite |
| Backend | Express + TypeScript |
| ORM | Prisma |
| Banco | PostgreSQL (Supabase) |
| Auth | JWT + bcryptjs |
| Deploy | Render (API) + Vercel (Dashboard) |

## Setup Local

```bash
# 1. API
cd api
cp .env.example .env   # Configure suas variáveis
npm install
npx prisma generate
npm run dev

# 2. Dashboard  
cd dashboard
cp .env.example .env
npm install
npm run dev

# 3. Mobile
cd mobile
cp .env.example .env
npm install
npx expo start
```

## Funcionalidades

- ✅ Cadastro e login de clientes
- ✅ Seleção de quiosque e mesa
- ✅ Cardápio com categorias e imagens
- ✅ Carrinho de compras (+/−)
- ✅ Envio de pedidos para a cozinha
- ✅ Acompanhamento de status em tempo real
- ✅ Comanda acumulada
- ✅ Divisão de conta entre amigos
- ✅ Confirmação de entrega pelo garçom
- ✅ Voucher de desconto no primeiro uso
- ✅ Painel KanBan da cozinha com autenticação
- ✅ Gerenciamento de promoções pelo proprietário
- ✅ Row Level Security (RLS) no Supabase

## Credenciais de Teste (Admin)

```
Email: admin@tanao.com
Senha: admin123
```

## Licença

Projeto proprietário — todos os direitos reservados.
