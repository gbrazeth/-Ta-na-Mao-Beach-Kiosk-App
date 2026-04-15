# Casos de Uso (Detalhamento)

Este documento aprofunda detalhadamente como a interação usuário-sistema acontece sob cada cenário.

## Glais do Sistema de Casos de Uso
1. **Ator Principal:** Cliente (Usuário Final na praia)
2. **Sistema:** App Frontend + API (Supabase)

---

### UC01 - Autenticar-se ou Registrar Conta Básica
**Objetivo:** Permitir a segurança e integridade das contas atreladas a cobranças.
**Pré-condições:** O app foi instalado e foi aberto no celular.

1. O ator abre o sistema e visualiza a tela inicial ("Comece Agora" ou "Acessar Conta").
2. O ator opta criar conta. E preenche as caixas formadas (Nome, Email, CPF, etc).
3. O sistema despacha a request HTTPS ao Auth backend (Supabase).
4. O Supabase processa e cria um `user`.
5. O Supabase retorna 200 OK e a sessão Token (JWT) ao React Native.
6. O sistema avança o Ator para a UI de Seleção de Quiosques.

### UC02 - Ocupar uma Mesa em um Quiosque
**Objetivo:** Associar o usuário corrente a uma coordenada física na praia.
**Pré-condições:** Ator está logado.

1. O sistema carrega e exibe os Quiosques num raio válido ou globalmente.
2. O ator seleciona o card de um Quiosque ("Arena Zero 1").
3. O sistema carrega os dados de posições físicas do estabelecimento ("Mesas").
4. O ator examina mesas livres.
5. O ator clica na "Mesa 12".
6. O componente Global Statement (Zustand) no frontend é preenchido com: `{ kioskId: ID, tableId: 12 }`.
7. O sistema direciona o ator para o dashboard principal mostrando "Mesa 12" e habilitando o botão "Ver Cardápio".

### UC03 - Efetuação de Pedido Digital (Lançamento na Comanda)
**Objetivo:** Transacionar a intenção de consumo (Carrinho Parcial).
**Pré-condições:** O ator tem conta + localização válida definida (UC02).

1. O ator navega para "Ver Cardápio".
2. O ator clica repetidas vezes no botão `(+)` dos produtos desejados.
3. O ator direciona à "Revisão do Pedido Atual" e clica em "Confirmar Pedido".
4. O sistema compila uma lista JSON com os itens e envia (INSERT) para o Supabase.
5. O sistema limpa o carrinho provisório local.
6. O sistema **não cobra** o usuário neste momento, mas o direciona para a tela de "Status do Pedido" para ele ver que a cozinha recebeu.

### UC04 - Resposta e Manipulação de Fluxo do Pedido (Socket Real-time)
**Objetivo:** Impedir ansiedade no cliente e garantir confiabilidade do tempo.
**Pré-condições:** Um pedido recente encontra-se gravado no sistema.

1. O ator localiza e observa a tela do "Status da Comanda" no app nativo.
2. O React Native (através do Supabase Realtime) escuta os rows desse pedido.
3. O atendente clica no PDV para marcar ("Preparando").
4. O banco de dados dispara ao Socket um Web Payload "UPDATE".
5. A interface do usuário acende automaticamente a UI "Em Preparo".

### UC05 - Fechamento da Comanda e Pagamento
**Objetivo:** Pagar o montante acumulado e liberar a mesa.
**Pré-condições:** O ator possui pedidos (entregues ou não) atrelados à sua sessão.

1. Da tela de Status ou Home, o ator clica em "Minha Comanda" (Aba Ativa).
2. O sistema faz um SELECT SUM() de todos os pedidos daquele cliente na mesa X.
3. O sistema exibe o Total Acumulado e lista o histórico de consumo.
4. O ator escolhe "Continuar Comprando" (retornando ao UC03) ou "Ir para Pagamento".
5. O ator clica em pagar, escolhe o método de pagamento (Pix/Cartão).
6. O sistema confirma a transação financeira, marca a Tab como *Fechada* e libera a "Mesa 12" no backend para outros clientes.
