# Case de engenharia Itau - .NodeJS

## READ.ME ATUALIZADO

# Aplicação de Gestão de Clientes e Transações

Esta aplicação é um sistema simples de gerenciamento de clientes e suas transações financeiras (depósitos e saques), desenvolvido com **NestJS** para o backend e **Angujar** para o frontend. A aplicação permite criar, atualizar, listar, deletar clientes e realizar movimentações financeiras com validação de dados.

## [BACKEND] Inicialização do Servidor

Vamos iniciar pela etapa do backend 😄

1. Abra um terminal (Windows+R → cmd) e navegue até a raiz do projeto
2. No projeto, entre no diretório backend e, em seguida, em app.
3. Instale as dependências, caso ainda não tenha feito:
   ```bash
   npm install
   ```
4. Inicie a aplicação NestJS:

   ```bash
   npm run start
   ```

   O servidor será iniciado na porta 8080.</br>
   ⚠️ Importante: Mantenha este terminal aberto, pois ele será o servidor da aplicação.</br>

5. Abra um segundo terminal (Windows+R → cmd) e execute a mesma navegação anteior para executar os comandos de teste ainda via curl.

## Testando as Rotas

Abaixo estão os comandos curl que podem ser executados no segundo terminal para testar todas as funcionalidades.
Vamos iniciar criando alguns clientes de exemplo antes de executar os testes via frontend.

### Consultando todos os clientes

Ao iniciar a aplicação, automaticamente um cliente já foi adicionado como teste durante a execução do onModuleInit. Para consultá-lo, execute o comando abaixo:

```bash
curl -X GET http://localhost:8080/clientes/
```

Se você viu o cliente 'TESTE' sendo listado, estamos indo muito bem até aqui! 🎉

### Criando novos clientes

Execute os três comandos de exemplo abaixo, assim vamos popular nossa tabela:

```bash
curl -X POST http://localhost:8080/clientes/novo -H "Content-Type: application/json" -d "{\"name\":\"Primeiro Cliente\",\"email\":\"primeiro.cliente@email.com\",\"balance\":1000,\"password\":1234}"

curl -X POST http://localhost:8080/clientes/novo -H "Content-Type: application/json" -d "{\"name\":\"Segundo Cliente\",\"email\":\"segundo.cliente@email.com\",\"balance\":2000,\"password\":5678}"

curl -X POST http://localhost:8080/clientes/novo -H "Content-Type: application/json" -d "{\"name\":\"Terceiro Cliente\",\"email\":\"terceiro.cliente@email.com\",\"balance\":3300,\"password\":3098}"
```

Por hora, aqui é o suficiente pelo terminal, mas ainda é possível executar todas as demais funções por aqui.</br>
Para explorar um pouco mais as funcionalidades oferecidos via terminal, execute os comndos abaixo. Ou, pule para a seção _[FRONTEND] Inicialização do Servidor_.

### Consultar cliente por ID

```bash
curl -X GET http://localhost:8080/clientes/<id gerado após a criação do cliente>
```

### Consultar todos os clientes

```bash
curl -X GET http://localhost:8080/clientes/
```

### Atualizar cliente

```bash
curl -X PUT http://localhost:8080/clientes/ -H "Content-Type: application/json" -d "{\"id\":\"<id gerado após a criação do cliente>\",\"name\":\"Primeiro Cliente Atualizado\"}"
```

### Depositar valor

```bash
curl -X POST http://localhost:8080/clientes/<id gerado após a criação do cliente>/depositar -H "Content-Type: application/json" -d "{\"amount\": 180}"
```

### Sacar valor

```bash
curl -X POST http://localhost:8080/clientes/<id gerado após a criação do cliente>/sacar -H "Content-Type: application/json" -d "{\"amount\":450,\"password\":1234}"
```

## Observações

1. Todos os testes devem ser feitos com o servidor em execução na porta 8080.
2. Ao criar novos clientes, substitua o ID nos demais testes conforme necessário.

## **⚠️ Importante: não feche os terminais! Mantenha-os em execução durante os próximos passos para o correto funcionamento da aplicação frontend.**

## [FRONTEND] Inicialização do Servidor

Vamos continuar com a etapa do frontend 😄

1. Abra um novo terminal (Windows+R → cmd) e navegue até a pasta raiz do projeto.
2. ntre no diretório frontend e, em seguida, em app.
3. Caso ainda não tenha feito, instale todas as dependências do Angular:

```bash
npm install
```

4. Para iniciar o servidor de desenvolvimento do Angular, execute o seguinte comando:

```bash
ng serve
```

O Angular vai compilar a aplicação e abrir uma página no navegador em: http://localhost:4200</br>
⚠️ Mantenha esse terminal aberto, ele precisa rodar enquanto você usa a aplicação.

5. Abrir a aplicação no navegador
   - Abra o navegador e acesse http://localhost:4200
   - Você deverá ver a interface web da aplicação, com todos os clientes criados anteriormente sendo listados (ou, pelo menos, o cliente TESTE, caso não tenha populado a tabela na etapa de backend).
   - Todas as operações (criar, listar, atualizar, deletar clientes, depositar e sacar valores) estão conectadas à API que iniciamos anteriormente.

## Adicionais

### Qualidade

Ambos os projetos estão com 100% de cobertura nos testes unitários, garantindo que toda a aplicação está devidamente testada.

- Backend: no terminal backend, onde os comandos de testes foram executados, execute o comando abaixo para acessar o relatório de cobertura de teste:

```bash
npm run test:cov
```

- Frontend: no terminal frontend, onde o servidor front foi iniciado, execute o comando abaixo para acessar o relatório de cobertura de teste:

```bash
ng test --code-coverage
```

## ...continuação

[DOC OLD]

## Introdução

Neste projeto esta sendo utilizada a base de dados sqlite com a seguinte tabela:

    Tabela: CLIENTES > "Registro relacionados ao cadastro de clientes"
    - id    - INTEGER NOT NULL AUTOINCREMENT PRIMARY KEY
    - nome  - TEXT    NOT NULL
    - email - TEXT    NOT NULL UNIQUE
    - saldo - FLOAT

No projeto foi disponibilizada uma API de Clientes com os metodos abaixo realizando acoes diretas na base de dados:

    GET    clientes                - LISTAR TODOS OS CLIENTES CADASTRADOS
    GET    clientes/{ID}           - RETORNAR OS DETALHES DE UM DETERMINADO CLIENTES PELO ID
    POST   clientes                - REALIZA O CADASTRO DE UM NOVO CLIENTE
    PUT    clientes/{ID}           - EDITA O CADASTRO DE UM CLIENTE JÁ EXISTENTE
    DELETE clientes/{ID}           - EXCLUI O CADASTRO DE UM CLIENTE
    POST   clientes/{ID}/depositar - ADICIONA OU SUBTRAI DETERMINADO VALOR DO SALDO DE UM CLIENTE
    POST   clientes/{ID}/sacar     - ADICIONA OU SUBTRAI DETERMINADO VALOR DO SALDO DE UM CLIENTE

## Ações a serem realizadas

1. Faça o fork do projeto no seu github. Não realize commits na branch main e nem crie novas branchs.
2. O código da api de clientes faz mal uso dos objetos, não segue boas práticas e não possui qualidade. Refatore o codigo utilizando as melhores bibliotecas, praticas, patterns e garanta a qualidade da aplicação. Fique a vontade para mudar o que achar necessário.
3. O controle de saldo do cliente possui um erro. Identifique e implemente a correção
4. Para nós segurança é um tema sério, implemente as ações que achar prudente para garantir a segurança da sua aplicação
5. Utilizando o Angular, crie uma aplicação web que consuma todos os metodos da API de clientes

Após finalizar o case, envie o link do seu github com a solução final para o e-mail andre.gattini@itau-unibanco.com.br

```

```
