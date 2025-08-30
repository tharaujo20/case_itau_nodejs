# Case de engenharia Itau - .NodeJS

# Aplicação de Gestão de Clientes e Transações

Esta aplicação é um sistema simples de gerenciamento de clientes e suas transações financeiras (depósitos e saques), desenvolvido com **NestJS** para o backend e **Angular** para o frontend. A aplicação permite criar, atualizar, listar, deletar clientes e realizar movimentações financeiras com validação de dados.

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

Ao iniciar a aplicação, automaticamente um cliente já foi adicionado como teste durante a execução do onModuleInit(). Para consultá-lo, execute o comando abaixo:

```bash
curl -X GET http://localhost:8080/clientes/
```

Se você viu o cliente 'TESTE' sendo listado, estamos indo muito bem até aqui! 🎉

### Criando novos clientes

Execute os três comandos de exemplo abaixo, assim vamos popular nossa tabela:

```bash
curl -X POST http://localhost:8080/clientes -H "Content-Type: application/json" -d "{\"name\":\"Primeiro Cliente\",\"email\":\"primeiro.cliente@email.com\",\"balance\":1000,\"password\":1234}"

curl -X POST http://localhost:8080/clientes -H "Content-Type: application/json" -d "{\"name\":\"Segundo Cliente\",\"email\":\"segundo.cliente@email.com\",\"balance\":2000,\"password\":5678}"

curl -X POST http://localhost:8080/clientes -H "Content-Type: application/json" -d "{\"name\":\"Terceiro Cliente\",\"email\":\"terceiro.cliente@email.com\",\"balance\":3300,\"password\":3098}"
```

Por hora, aqui é o suficiente pelo terminal, mas ainda é possível executar todas as demais funções por aqui.</br>
Para explorar um pouco mais as funcionalidades oferecidas via terminal, execute os comandos abaixo. Ou, pule para a seção _[FRONTEND] Inicialização do Servidor_.

### Consultar cliente por ID

```bash
curl -X GET http://localhost:8080/clientes/<id gerado após a criação do cliente>
```

### Consultar todos os clientes

```bash
curl -X GET http://localhost:8080/clientes/
```

### Atualizar cliente

Permitido atualizar somente os campos _name_, _email_ e/ou _password_.

```bash
curl -X PUT http://localhost:8080/clientes/ -H "Content-Type: application/json" -d "{\"id\":\"<id gerado após a criação do cliente>\",\"name\":\"Cliente Atualizado\"}"
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
2. Entre no diretório frontend e, em seguida, em app.
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

### Testes

Ambos os projetos estão com 100% de cobertura nos testes unitários, garantindo que toda a aplicação está devidamente testada.

- Backend: no terminal backend, onde os comandos de testes foram executados, execute o comando abaixo para acessar o relatório de cobertura de teste:

```bash
npm run test:cov
```

- Frontend: no terminal frontend, onde o servidor front foi iniciado, execute o comando abaixo para acessar o relatório de cobertura de teste:

```bash
ng test --code-coverage
```

### TAAC

Incluso um arquivo do que seria um TAAC executado na esteira em momento de implanatação para a o projeto de backend. O arquivo encontra-se dentro do projeto /backend, em /test. Para executar, navegue até a pasta /app e execute o comando abaixo:

```bash
npm run test:e2e
```

### Notas

1. Porque o Nest.js para o Backend?
   Alguns critérios me fizeram tomar a decisão de trocar o uso de Express pelo Nest.js.

   - Escalabilidade:
     Embora o Nest.js tenha uma maior curva de aprendizado e, aparentemente, adiciona complexidade a algo simples, eu entendo que ele é um framework mais preparado para tratar a escalabilidade da aplicação quando necessário.

     Ainda que este case seja algo pontual e simples, imagine de na realidade algo que começa simples começa a crescer (o que é um movimento natural nas apps), sua estrutura modular e recursos nativos para tratar injestão de dependências, permite um crescimento saudável e organizado.

   - Clean Architecture:
     Aqui consigo mas facilmente aplicar o modelo de arquitetura hexagonal, tratando cada módulo com a estrutura de /application, /domain e /infrastrucre, como é esperado na ideia de portas/adapters da hexagonal. Somado ao fator prática, pois muitas aplicações que lido no dia a dia estão cosntruídas assim e isso tras familiaridade à minha implantação.

   - SOLID, Clean Code:
     A aplicação adequada desses padrões garante um código mais tranquilo de evoluir e de dar as devidas manutenções. Além disso, para mim, um dos principais indicadores de um código bem feito é a facilidade de implementar os testes unitários (afinal, quando mais gambiarra e 'coisa amarrada' mais difícil fica de testar tudo). O resultado em 100% é um número esperado e, relativamente, fácil de ser atingido com um código limpo e padronizado.

   - Typescript:
     Aqui também considero a familiaridade que tenho usando Typescript, dado que o Nest já é nativo em .ts, isso facilita as configurações e já garante tipagem forte desde o início.

2. Jest.js para testes unitários
   Além de já ser um recurso nativo do Nest ao criar o projeto, vejo que ele trás outras vantagens frente a outros frameworks, como o Mocka por exemplo. Ele acaba sendo mais performático na execução por conseguir executar vários cenários de forma paralela.

   A função do _--coverage_ é uma das que mais uso e considero um grande facilitador. Por fim, também o ponto da experiência e familiaridade. Vi o Mocka apenas em alguns repos muito antigos, a grande maioria dos projetos que vi, usavam jest.

3. Resolução de problemas
   A etapa do frontend foi, especialmente, desafiadora pelo fato de ser quase que um primeiro contato com o Angular. Aqui, pessoalmete, o case foi mais _como usar as ferramentas que tenho a disposição para resolver este problema?_. De forma prática e autônoma, consegui implementar meu primeiro projeto front do zero. Algo básico, porém com as funcioanlidades esperadas e tudo testado.

4. O problema com a gestão do saldo
   O case original apresentava um erro com o controle de saldo do cliente. O que identifiquei foi que a forma com que a tabela era criada o 'saldo' sempre ficava 'null' e, mesmo queeu tentasse inferir um novo valor, o null não se alterava.

   Para este caso, na nova tabela foi criado como 'not null' e 'default 0' e na etapa de criação informar o saldo é opcional. Caso informado algum valor no momento da criação de um novo cliente, este passa a ser o saldo inicial. Caso não seja, o cliente inicia com saldo 0.

   As operações de depósito e saque conseguem manipular este valor corretamente.

5. Segurança
   O case original exigia uma ação de segurança. Neste caso, por tratar-se de algo básicas e sem necessidade de expandir os limites do case, optei por adicionar a criação de uma senha para cada cliente e, ao tentar efetuar a **operação de saque**, é **obrigatório** informar a senha. O ideal é que se memorize a senha informada nos testes, pois esta informação não é exibida em nenhum lugar no front e exigida no saque.

   Existe ainda a função 'editar senha' pela rota de atualização, caso necessário. Mesmo assim, memorize-a durante os testes pois ela não é exibida via front.

6. Estética
   Adicionei algumas boas práticas e usos de ferramentas que facilitam a padronização e garantem uma boa estética ao código.

   - ESLint, que observa a implementação prevenindo erros lógicos ou de sintaxe;
   - Prettier, que cuida do estilo, formatação e mantém uma aparência consistente;
   - Conventional commits, que mantém os comentários dos commits objetivos conforme a convenção de "contexto: descrição"

7. Adicionais
   Há notas em formato de comentário em quase todos os arquivos do backend, onde informo algumas decisões e detalhes adicionais envolvendo minha implementação.

8.
