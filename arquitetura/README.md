# Arquitetura

Minha ideia para este tópico foi trazer duas propostas: uma básica, outra robusta.</br>
O intuito é mostrar que existem diversas formas de chegar a uma solução e que a decisão final deve-se pautar principalmente na estratégica a ser seguda e qual opção a equipe está disposta a lidar.

## Básica

**Opção menos resiliente, mais barata</br>**
Começando com algo básico, esta opção consiste principalmente na atuação de lambdas.

- Serviço S3 de Static Website Hosting para garantir o funcionamento dos arquivos estáticos do frontend. O próprio browser do cliente se encarrega pelas requisições à api do backend.
- API Gateway apontando para as diferentes AZs, assegurando resiliência.
- Segregação da lambdas por _novos módulos_: Neste exemplo, as responsabilidades estão divididas e cada lambda escala somente a necessidade do domínio. **Atenção, aqui as lambdas estão, somente, distribuídas, e não balanceadas**
- Adoção de Redis como opção para cache, mantendo os dados dos clientes em fácil acesso enquanto ele estiver usando o serviço.
- O banco de dados em AuroraDb para assegurar o valor ainda próximo da proposta inicial, que era relacional.
- DataDog como principal serviço destinado à observabilidade.

**Ponto de atenção:**</br>

- O rate limit padrão de lambdas são de 1000 requests simultaneas por conta. Para que este caso seja executado com sucesso, seria necessário solicitar o aumento de quotas das lambdas à AWS.

**Conclusão**</br>
Básica: barata, serverless com Lambda + Aurora, cobre o essencial de segurança, observabilidade e volumetria esperada.

## Robusta

**Opção mais resiliente, menos barata</br>**
Pensando em uma evolução mais consistênte, esta opção consiste principalmente na atuação containers.

- Cloudfront utilizado para gerenciar a camada de frontend, adicionando melhor tempo de resposta e performance à esta camada, estando hospedado em uma Edge Location.
- Serviços adicionais de segurança como o WAF e o Shield, que atuam nas Edge Locations para prevenindo ataques.
- API Gateway apontando para o load balancer, garantindo balanceamento de carga dentre as zonas disponíveis.
- Load Balancer apontando e balanceando o volume de requisições para os clusters ECS das AZs
- Fargate para lidar com o ciclo de vida dos containers de forma serverless.
- Distribuídos entre os dois domínios, gestão do cliente e transações.
- Escalabilidade do backend assegurada pelo Auto Scalling Group, algo também correlacionado ao Fargate.
- Adoção de Redis como opção para cache, mantendo os dados dos clientes em fácil acesso enquanto ele estiver usando o serviço.
- Troca para DynamoDb (chave-valor) visando usufruir da performance, resiliência, escalabilidade e baixo custo que este banco oferece. Entendo que a aplicação deste case é adaptável para o uso de um chave-valor, por isso a alteração torna-se possível.
- Secrets Manager para gestão de credenciais.
- DataDog como principal serviço destinado à observabilidade.

**Pontos de atenção:**

- Cluster ECS no lugar de EKS apenas para praticidade da proposta a ser apresentada, dado que no EKS há mais itens a serem gerenciados pelo Cliente, exigindo maior curva de aprendizado relacionada ao Kubernets. Ainda assim, também seria uma opção que se ecaixa neste contexto
- A proposta totalmente voltada para recursos serverless é prática e possível, porém com custo bem mais elevado, o que pode ser um ponto grave ao se considerar FinOps.

**Conclusão**</br>
Robusta: resiliente, escalável, segura e multi-AZ, mas mais cara (ECS/Fargate, Dynamo, CloudFront, WAF, Shield)
