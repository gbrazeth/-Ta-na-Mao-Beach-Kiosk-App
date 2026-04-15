# Estrutura do Projeto React Native

A arquitetura do projeto segue o padrão modular baseado em *features* em um ambiente bare/managed de Expo com React Native. Esta estrutura facilita a escalabilidade, permitindo que a equipe encontre os arquivos com facilidade.

## Árvore de Diretórios (Sugestão para Expo)

```text
beach-kiosk-app/
├── assets/                 # Imagens, fontes personalizadas e ícones da aplicação real
├── src/                    # Todo o código fonte da aplicação
│   ├── components/         # Componentes React Native reutilizáveis
│   │   ├── ui/             # Componentes burros (Botões, Inputs, Cards, Badges)
│   │   ├── layout/         # Componentes estruturais (Headers, Footers, Containers)
│   │   └── business/       # Componentes com regra de negócio (ProductCard, CartItemBox)
│   │
│   ├── config/             # Configurações globais e inicialização de bibliotecas
│   │   ├── supabase.ts     # Cliente de conexão do Supabase
│   │   └── theme.ts        # Variáveis de Cores (Azul profond, Dourado), Espaçamentos
│   │
│   ├── navigation/         # Configurações do React Navigation
│   │   ├── MainStack.tsx   # Pilha de telas principais pós-login
│   │   └── AuthStack.tsx   # Navegação para telas de autenticação
│   │
│   ├── screens/            # Telas do aplicativo (Agrupadas por funcionalidade)
│   │   ├── auth/           # LoginScreen.tsx, RegisterScreen.tsx, WelcomeScreen.tsx
│   │   ├── kiosk/          # KioskSelectionScreen.tsx, TableSelectionScreen.tsx
│   │   ├── home/           # DashboardScreen.tsx (Resumo da comanda atual)
│   │   ├── menu/           # CategoryScreen.tsx, ProductListScreen.tsx
│   │   └── order/          # CartScreen.tsx, PaymentScreen.tsx, OrderStatusScreen.tsx
│   │
│   ├── services/           # Comunicação com a API e backend local
│   │   ├── authService.ts  # Métodos de registro e login com Supabase Auth
│   │   ├── kioskService.ts # Buscar quiosques e mesas
│   │   └── orderService.ts # Criar pedido e escutar status via WebSockets
│   │
│   ├── store/              # Gerenciador de estado global (Zustand ou Redux)
│   │   ├── cartStore.ts    # Lógica de salvar items, quantidades e total financeiro
│   │   └── userStore.ts    # Dados da sessão e quiosque/mesa ativa
│   │
│   ├── types/              # Definições de tipagens TypeScript (Models do Supabase)
│   │   └── index.d.ts      # Tipose de Product, Order, User, Kiosk
│   │
│   └── utils/              # Funções utilitárias (Helpers)
│       ├── currency.ts     # Formatador de R$ (formato brasileiro)
│       └── validations.ts  # Validação de CPF, email e Regex's
│
├── App.tsx                 # Ponto de entrada da raiz da aplicação
├── app.json                # Configurações gerais do Expo (nome, icon, splash screen)
├── package.json            # Dependências NPM (react-navigation, supabase-js, zustand)
└── tsconfig.json           # Configuração do compilador TypeScript
```

## Benefícios da Estrutura
- **Separação de Preocupações:** Funções de API (`services`) não contêm regras de interface gráfica.
- **Tipagem Segura:** A pasta `types` evita erros ao consumir os dados dinâmicos do Supabase.
- **Armazenamento Global Isolado:** A pasta `store` unifica como o Carrinho e a Sessão do Usuário trafegam pelos fluxos de tela sem 'prop drilling' complexo.
