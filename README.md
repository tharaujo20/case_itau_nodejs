# Case de engenharia Itau - .NodeJS

## READ.ME ATUALIZADO

# Aplicação de Gestão de Clientes e Transações

Esta aplicação é um sistema simples de gerenciamento de clientes e suas transações financeiras (depósitos e saques), desenvolvido com **NestJS**. Permite criar, atualizar, deletar clientes e realizar movimentações financeiras com validação de dados.

## Inicialização do Servidor

1. Abra um terminal na raiz do projeto.
2. Instale as dependências, caso ainda não tenha feito:
   ```bash
   npm install
   ```
3. Inicie a aplicação NestJS:
   ```bash
   npm run start
   ```
   O servidor será iniciado na porta 8080.</br>
   ⚠️ Importante: Mantenha este terminal aberto, pois ele será o servidor da aplicação.</br>
   Abra um segundo terminal para executar os comandos de teste via curl.

## Testando as Rotas

Abaixo estão os comandos curl que podem ser executados no segundo terminal para testar todas as funcionalidades.

### Criar um novo cliente

```bash
curl -X POST http://localhost:8080/clientes/novo -H "Content-Type: application/json" -d "{\"name\":\"Nome do Teste\",\"email\":\"nome.teste@email.com\",\"balance\":14551,\"password\":1910}"
```

### Consultar cliente por ID

```bash
curl -X GET http://localhost:8080/clientes/<id gerado após a criação do cliente no passo anterior>
```

### Consultar todos os clientes

```bash
curl -X GET http://localhost:8080/clientes/
```

### Atualizar cliente

```bash
curl -X PUT http://localhost:8080/clientes/ -H "Content-Type: application/json" -d "{\"id\":\"18e9078f-f6ce-4b30-ba78-b917554f0e11\",\"name\":\"sucesso ultimo teste\"}"
```

### Depositar valor

```bash
curl -X POST http://localhost:8080/clientes/18e9078f-f6ce-4b30-ba78-b917554f0e11/depositar -H "Content-Type: application/json" -d "{\"amount\": 180}"
```

### Sacar valor

```bash
curl -X POST http://localhost:8080/clientes/18e9078f-f6ce-4b30-ba78-b917554f0e11/sacar -H "Content-Type: application/json" -d "{\"amount\":450,\"password\":1910}"
```

## Observações

1. Todos os testes devem ser feitos com o servidor em execução na porta 8080.
2. Ao criar novos clientes, substitua o ID conforme necessário.
3. Os DTOs garantem a validação dos dados, incluindo:
   - _amount_ deve ser número e não nulo.
   - _password_ deve ter 4 dígitos.

---

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
