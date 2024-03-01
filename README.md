# Teste de Desenvolvimento Web - Cargo de Programador

## Descrição do Projeto

Este projeto foi desenvolvido como parte do teste de Desenvolvimento Web para o cargo de Programador. A aplicação é uma "Lista de Tarefas" (To-Do List) com funcionalidades completas, atendendo aos requisitos especificados.

## Como Executar a Aplicação
### Backend: Node.js

1. Clone este repositório.
2. Navegue até o diretório do back-end: `cd backend`.
3. Instale as dependências: `npm install`.
4. Crie o arquivo sendgrid.env e defina SENDGRID_API_KEY
5. Inicie o servidor: `npm start`.

### Frontend:
#### O backend está no repositório: https://github.com/RaphaelBrasil/brothermotos-frontend/

1. Clone o repositório do frontend.
2. Navegue até o diretório do front-end: `cd frontend`.
3. Instale as dependências: `npm install`.
4. Crie o arquivo .env e defina REACT_APP_API_SERVER_URL
5. Inicie a aplicação: `npm start`.



## Observações

-   Existem variaveis de ambiente nesse projeto tanto para acesso ao banco, quanto para o envio dos emails.
-   Estou disponível para discutir minhas escolhas e abordagens adotadas.

## Funcionalidades

-   **Adicionar Tarefas:**

    -   Os usuários podem adicionar novas tarefas à lista, cada uma com um título que descreve a atividade.

-   **Editar Tarefas:**

    -   Os usuários podem editar o título de uma tarefa existente.

-   **Excluir Tarefas:**

    -   Os usuários podem excluir uma tarefa da lista, com a opção de confirmação para evitar exclusões acidentais.

-   **Marcar Tarefas como Concluídas:**

    -   Os usuários podem marcar uma tarefa como concluída, com distinção visual entre tarefas pendentes e concluídas.

-   **Filtrar Tarefas:**

    -   Os usuários podem filtrar as tarefas por diferentes critérios, como status (pendente/concluída) ou data de criação.

-   **Ordenar Tarefas:**

    -   Os usuários podem ordenar as tarefas por diferentes critérios, como título, data de criação ou status.

-   **Pesquisar Tarefas:**

    -   Os usuários podem pesquisar tarefas por partes do conteúdo ou partes do título, com resultados de pesquisa exibidos instantaneamente conforme o usuário digita.

-   **Salvar Tarefas:**

    -   As tarefas são salvas em um banco de dados para persistência, sendo restauradas na lista após o fechamento e reabertura da aplicação.

-   **Limpar Lista de Tarefas Concluídas:**

    -   Os usuários têm a opção de limpar todas as tarefas concluídas da lista de uma só vez.

-   **Feedback Visual:**

    -   Fornece feedback visual imediato ao usuário ao adicionar, editar ou excluir tarefas.

-   **Notificação por E-mail:**
    -   Notifica o usuário quando ocorre mudança de status da tarefa.

Agradecemos pela oportunidade e aguardamos suas considerações!
