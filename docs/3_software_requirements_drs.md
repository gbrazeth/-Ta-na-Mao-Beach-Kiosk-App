# Documento de Requisitos de Software (DRS) - MVP

Este documento consolida os requisitos centrais estabelecidos para construir o Produto Mínimo Viável (MVP) do "Tá na Mão", aplicativo voltado para o cliente de quiosques de praia.

## 1. Visão Geral do Sistema
O sistema consiste em um "Consumer App" (App móvel para clientes) alimentado por um banco de dados na nuvem (Supabase). Seu propósito é substituir cardápios físicos de praia por uma experiência ágil de autoatendimento na mesa/guarda-sol, onde o cliente acessa produtos, realiza um pedido que é transmitido digitalmente ao quiosque, e acompanha em tempo real o preparo de sua comanda.

---

## 2. Requisitos Funcionais (RFs)
Os RFs definem o que o sistema **vai fazer**.

*   **RF01 - Autenticação de Usuário**
    *   O sistema deve permitir que clientes criem uma conta via e-mail e senha.
    *   O sistema deve suportar Login Social (Integração inicial de UI com o Google).
*   **RF02 - Seleção de Quiosque e Mesa**
    *   O sistema deve exibir uma lista atualizada dos quiosques ativos no sistema.
    *   O sistema deve listar as mesas baseadas no quiosque selecionado.
    *   O sistema deve impossibilitar o usuário de associar-se a uma mesa com status "Em Uso" (Ocupada).
*   **RF03 - Catálogo de Produtos e Cardápio**
    *   O sistema deve carregar as categorias exclusivas e os produtos (com foto, preço, e informações) atrelados especificamente ao quiosque selecionado.
*   **RF04 - Gestão do Carrinho (Pré-Pedido)**
    *   O sistema deve permitir que o usuário adicione ou remova itens no carrinho temporário.
    *   O sistema deve calcular o valor numérico somado dos itens incluídos neste carrinho temporário.
*   **RF05 - Efetivação do Pedido Avulso (Envio p/ Cozinha)**
    *   O sistema deve permitir enviar os itens do carrinho para o banco de dados oficializando-o como um `Order` (Pedido Avulso), atrelando-o à "Comanda" (Tab) principal daquela mesa.
*   **RF06 - Monitoramento de Status (Real-time)**
    *   O sistema deve mostrar ao usuário a etapa atual de preparação do seu pedido na seção Status: "Aguardando", "Preparando" ou "Pronto".
*   **RF07 - Resumo da Comanda Geral (Conta Acumulada)**
    *   O sistema deve permitir que o usuário veja a totalidade financeira e a lista de TODOS os pedidos avulsos já solicitados em sua permanência na mesa.
*   **RF08 - Fechamento de Comanda e Pagamento**
    *   O sistema deve permitir o fechamento voluntário da mesa, travando novos pedidos e procedendo para a quitação financeira do montante total da comanda acumulada.

---

## 3. Requisitos Não Funcionais (RNFs)
Os RNFs definem as **restrições e métricas de qualidade** de sistema.

*   **RNF01 - Plataforma e Acessibilidade**
    *   O app deve ser desenvolvido em modo cross-platform para ser distribuído em **iOS e Android** gerando o mesmo código (React Native / Expo).
*   **RNF02 - Desempenho (Performance)**
    *   A tela de cardápio deve ser exibida e popular os dados em menos de 2 segundos num cenário com conexão móvel básica (4G), requerendo um uso excelente em ambientes externos.
*   **RNF03 - Comunicação de Rede (Offline State)**
    *   Em caso de oscilações na rede de internet que é comum em praias, se a comunicação para enviar um pedido falhar, o React Native deve apresentar mensagens de falha adequadas ("Falha de Conexão, verifique seu sinal") e não resetar o estado interno do carrinho ou esvaziá-lo acidentalmente.
*   **RNF04 - UI/UX Especializada**
    *   A interface de visualização deverá possuir contraste elevado, suportando tipografias grandes (Ex: Inter/Roboto e peso Bold) fáceis de visualizar num ambiente ensolarado sob incidência de raios UV diretos na tela do celular do cliente.
*   **RNF05 - Segurança (Supabase RLS)**
    *   Para segurança, uma tabela `orders` só poderá ser visualizada no app pelo Client ID que a criou, utilizando Row Level Security no próprio PostgreSQL.
