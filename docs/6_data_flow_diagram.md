# Diagrama de Fluxo de Dados (DFD)

Abaixo descreve-se por meio de formato de sequência lógica o tráfego do dado em operações mais pesadas.

## Diagrama de Ciclo de Pedido & Sincronização em Tempo Real (Mermaid)

```mermaid
sequenceDiagram
    participant Cliente as App (React Native)
    participant C_State as React Zustand (Local Store)
    participant DB as Supabase Backend (PostgreSQL)
    participant Cozinha as PDV Kiosk (Painel Adm)

    Note over Cliente, Cozinha: Fase 1: Escolha no App (Sem internet)
    Cliente->>C_State: Click em (Adicionar "Chopp")
    C_State-->>Cliente: UI atualiza contagem para (1x) e $ Total
    Cliente->>C_State: Click em (Adicionar "Chopp" +1)
    
    Note over Cliente, Cozinha: Fase 2: Lançamento do Pedido (Envio p/ Cozinha)
    Cliente->>DB: POST: Confirmar Pedido Avulso (Payload JSON c/ Itens)
    DB-->>DB: Supabase Insere 'orders' (Status Inicial: Aguardando) e atrela a 'Comanda Pai'
    DB-->>Cliente: RES: 200 OK. Redireciona UI para [Status do Pedido]
    
    Note over Cliente, DB: Real-time escuta canal 'orders:id' (Supabase Sockets)
    Cliente->>DB: Abre WebSocket Listener
    
    Note over Cozinha, DB: Fase 3: Preparação do Local
    DB->>Cozinha: Interface web do bar apita [Novo Pedido Mesa 12!]
    Cozinha->>DB: Barmen clica "Atender e Preparar". PUT [Status: Preparando]
    
    Note over DB, Cliente: Fase 4: O Milagre Web-socket Frontend Realtime
    DB-->>Cliente: ⚡ PUSH UPDATE: [Payload Socket: status='Preparando']
    Cliente-->>Cliente: React Native injeta atualização em Tela Automaticamente
    
    Cozinha->>DB: Cozinha clica em "Prato Pronto". PUT [Status: Prato Pronto]
    DB-->>Cliente: ⚡ PUSH UPDATE: [Payload Socket: status='Prato Pronto']

    Note over Cliente, DB: Fase 5: Fechamento de Comanda (Opcional - A qualquer momento)
    Cliente->>DB: GET: Trazer Minha Comanda (Puxa soma de todos os pedidos daquela mesa/sessão)
    DB-->>Cliente: RES: Total Acumulado (Ex: R$ 120,00)
    Cliente->>DB: POST: Concluir Pagamento e Fechar Mesa (Via Pix/Gateway)
    DB-->>Cliente: RES: 200 OK. Mesa Liberada.
```

## Níveis Explicativos de Dados em Flow
1. **Zustand Interação:** Enquanto as edições do número de produtos ocorrem no carrinho (Ex: Mais cervejas ou exclusão de um prato), não deve estressar a leitura num banco de dados cloud remoto, a memória do celuar (Javascript state) segura e efetua todo trabalho de matemática.
2. **Postgres Inserção:** A transferência dos bits com formato JSON somente viaja em um disparo na rede HTTP sob ação incisiva (Apertar "Confirmar Pedido").
3. **Websocket Flow:** O status do pedido só viaja por uma via super leve através do Realtime API, poupando a API Supabase (REST), o que permite o React Native não se sobrecarregar, alterando componentes imediatamente.
