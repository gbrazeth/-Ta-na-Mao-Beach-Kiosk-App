# Plano de Desenvolvimento do MVP (Developer Plan)

Este documento descreve o roadmap de desenvolvimento do MVP (Produto Mínimo Viável) do aplicativo Tá na Mão, focando no fluxo do cliente, utilizando React Native (Expo) e Supabase.

## Fase 1: Setup e Infraestrutura (Semanas 1)
**Objetivo:** Configurar o ambiente, banco de dados e escopo básico do app.
- [ ] Inicializar projeto React Native com Expo (`npx create-expo-app`).
- [ ] Configurar TypeScript, ESLint, Prettier.
- [ ] Configurar roteamento usando React Navigation (Telas: Login, KioskSelection, Home, Menu, Cart, Status).
- [ ] Criar projeto no Supabase e gerar chaves de API.
- [ ] Modelar Banco de Dados no Supabase:
  - `users` (profiles vinculados ao Auth)
  - `kiosks` (dados dos quiosques: Arena Zero 1, Praia Sol)
  - `tables` (mesas por quiosque e status)
  - `products` (itens do cardápio)
  - `orders` e `order_items` (pedidos e itens).

## Fase 2: Autenticação e Fluxo Inicial (Semana 2)
**Objetivo:** Permitir que o usuário acesse o app e escolha onde está.
- [ ] Implementar integração de Login/Cadastro com Supabase Auth (Email/Senha e Botão Google OAuth).
- [ ] Desenvolver tela "InitialScreen" e "LoginScreen".
- [ ] Desenvolver "KioskSelectionScreen" buscando dados da tabela `kiosks` no Supabase.
- [ ] Desenvolver "TableSelectionScreen" buscando dados de mesas disponíveis.
- [ ] Implementar armazenamento global do estado local e usuário (Zustand ou Context API).

## Fase 3: Cardápio e Pedidos Avulsos (Semana 3)
**Objetivo:** Consumo do cardápio e geração de pedidos sem checkout imediato.
- [ ] Desenvolver "CustomerHomeScreen" (Dashboard do usuário focado na mesa).
- [ ] Integrar "MenuScreen" listando categorias e `products` do quiosque atual do Supabase.
- [ ] Criar a lógica de Carrinho de Compras (Adicionar, remover, alterar quantidade).
- [ ] Desenvolver "CartReviewScreen" para revisar o pedido atual e enviá-lo para a cozinha.
- [ ] Criar rotina para Inserir (INSERT) o Pedido (`orders`) e itens (`order_items`) no Supabase.

## Fase 4: Real-time Status e Fechamento de Comanda (Semana 4)
**Objetivo:** Acompanhamento do preparo, acúmulo de consumo e pagamento final.
- [ ] Desenvolver "OrderStatusScreen" consumindo dados em tempo real (Supabase Realtime subscriptions) para atualizar a timeline (Pendente -> Em Preparo -> Pronto).
- [ ] Desenvolver "ActiveTabScreen" (Minha Comanda) que exibe a soma de todos os pedidos já feitos na mesa.
- [ ] Desenvolver botão "Continuar Comprando" (volta pro menu) e "Fechar Comanda e Pagar" (Vai para checkout).
- [ ] Desenvolver "PaymentScreen" para concluir a conta acumulada e desocupar a mesa.

## Fase 5: Testes e Lançamento (Semana 5)
**Objetivo:** Qualidade, testes e publicação nas lojas.
- [ ] Homologação de usabilidade (UI/UX) equiparando com o Mockup Web.
- [ ] Testes de carga leve no Supabase e testes de concorrência de mesas.
- [ ] Build e distribuição nos canais de teste (TestFlight para iOS e Google Play Console - Internal Testing para Android).
