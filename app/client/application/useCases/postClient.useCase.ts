import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientManagerService } from '../services/clientManager.service';
import { CreateClientDto, ClientResponseDto } from '../../domain/client.model';
import { randomUUID } from 'crypto';

@Injectable()
export class PostClientUseCase {
  constructor(private readonly clientService: ClientManagerService) {}

  public async execute(newClient: CreateClientDto): Promise<void> {
    try {
      Logger.debug('[PostClientUseCase][execute] Starting...');

      const client: ClientResponseDto = {
        id: randomUUID(),
        name: newClient.name,
        email: newClient.email,
        saldo: 0, // saldo inicial sempre 0
      };

      await this.clientService.addClient(client);

      Logger.log(
        `[PostClientUseCase][execute] Success: client ${client.id} created`
      );
    } catch (error) {
      Logger.error(
        '[PostClientUseCase][execute] Error while posting client:',
        error
      );
      throw new InternalServerErrorException(error);
    }
  }
}

// Decorator Injectable, para que o nest considere esse serviço ao gerenciar a injeção de dependências
// Logger nativo do nest, integra com módulos e bibliotecas, pode ser instrumentalizado para 'alimentar' datadog //TODO VER ISSO AQUI como funciona
// Padrão [NomeDaClasse][NomeDoMetodo] padrão de geração de log para melhor identificação ao debuggar e analisar logs, facilita manutenção
// Custos: Correto uso dos tipos de logs visando custos.
// Logar em produção somente sucessos (.log) e erros (.error), demais tipos até homol, a menos que seja identificada outra necessidade
// Este caso de uso consome do serviço de clientes
// Caso de uso encapsula a camada de negócio prevista na arquitetura hexagonal
// Abstrai da implementação da camada de aplicação
// Reuso: Qualquer regra de negócio que precise CRIAR algo relacionado ao cliente, se serve deste caso de uso
// Resiliência: bloco try/catch na camada de caso de uso para tratativa do comportamento da regra
// Caso de uso de criação, as trataivas de negócio são aplicadas nessa camada

//Framework nest, arquitura hexagonal, princípios CleanCode, otimização de custos
