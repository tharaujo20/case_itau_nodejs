import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ClientCompleteDto, CreateClientDto } from '../../domain/client.model';
import { ClientManagerService } from '../services/clientManager.service';

@Injectable()
export class PostClientUseCase {
  constructor(private readonly clientService: ClientManagerService) {}

  public async execute(newClient: CreateClientDto): Promise<void> {
    try {
      Logger.debug('[PostClientUseCase][execute] Starting...');

      await this.checkIfClientExists(newClient.email);

      const client: ClientCompleteDto = {
        id: randomUUID(),
        name: newClient.name,
        email: newClient.email,
        saldo: 0,
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
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  private async checkIfClientExists(email: string): Promise<void> {
    const existingClient = await this.clientService.findByEmail(email);

    if (existingClient) {
      Logger.warn(
        `[PostClientUseCase][checkIfClientExists] Conflict: client with email ${email} already exists`
      );
      throw new ConflictException(
        `[PostClientUseCase][checkIfClientExists] Client with email ${email} already exists`
      );
    }
  }
}

//NOTAS DESTE ARQUIVO
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
