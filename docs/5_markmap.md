---
markmap:
  colorFreezeLevel: 3
---

# Estrutura Core - Tá na Mão App

## 👤 Usuário (Client Profile)
- ID (UUID)
- Nome
- CPF
- Email / Telefone
- Métodos de Pagamento (Futuro)

## 🏢 Quiosques (Partners)
- ID (UUID)
- Nome do Estabelecimento (ex: Arena Zero 1)
- Logo / Banner URL
- Status Abertura (Aberto / Fechado)
- **📍 Mesas Relacionadas**
  - Mesa ID
  - Número de Indentificação
  - Condição (Livre, Ocupada, Reservada)

## 🍔 Cardápio (Menu System)
- **Categorias (Categories)**
  - Id (Ex: Bebidas, Porções)
  - ID Quiosque Master
- **Produtos Finais (Items)**
  - Título / Nome
  - ID da Categoria (Join associativo)
  - Preço Base Numérico
  - Imagem Expositiva (S3 Bucket Url)
  - Disponibilidade (Habilitado / Faltando Estoque)

## 🧾 Comanda Mestra (Active Tab)
- ID da Comanda
- ID Usuário Dono
- ID Quiosque / Mesa Alvo
- Status Financeiro (Aberta / Paga / Cancelada)
- Timestamp (Abertura e Fechamento)
- **🛒 Pedidos Avulsos (Orders lançados na Comanda)**
  - ID do Pedido
  - Status Lógico Cozinha (Aguardando / Preparando / Entregue)
  - **🍟 Itens do Pedido (Order Details)**
    - Produto ID associado
    - Quantidade Adicionada
    - Valor Nominal Fixo gravado no Momento
    - Observação ("Sem gelo", "Sem cebola")
