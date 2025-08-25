import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import {
  Adapter,
  ClientCompleteDto,
  ClientResult,
  GetClientByIdDto,
} from '../../domain/client.model';
import { ClientManagerService } from '../services/clientManager.service';

@Injectable()
export class GetClientUseCase {
  constructor(private readonly clientService: ClientManagerService) {}

  public async execute(
    clientId?: GetClientByIdDto
  ): Promise<ClientResult | ClientResult[]> {
    try {
      Logger.debug('[GetClientUseCase][execute] Starting...');

      if (clientId) await this.checkType(clientId);

      const result = clientId
        ? await this.clientService.findOne(clientId)
        : await this.clientService.findAll();

      const adapted = await this.adaptResult(result);
      Logger.log('[GetClientUseCase][execute] Success', adapted);

      return adapted;
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(`Client ${clientId.id} not found`);
      }

      Logger.error(
        '[GetClientUseCase][execute] Error while getting client:',
        error
      );
      throw new InternalServerErrorException(error);
    }
  }

  private async checkType(clientId: GetClientByIdDto): Promise<boolean> {
    if (isUUID(clientId.id)) {
      return;
    }

    throw new Error(
      `[GetClientUseCase][execute] ${clientId.id} is not a valid UUID`
    );
  }

  private async adaptResult(
    result: ClientCompleteDto | ClientCompleteDto[]
  ): Promise<ClientResult[]> {
    let adaptedResult;

    Array.isArray(result)
      ? (adaptedResult = result.map((item: ClientCompleteDto) =>
          Adapter.adapter(item)
        ))
      : (adaptedResult = Adapter.adapter(result));

    return adaptedResult;
  }
}

//NOTAS DESTE ARQUIVO
// Decorator Injectable, para que o nest considere esse serviço ao gerenciar a injeção de dependências
// Logger nativo do nest, integra com módulos e bibliotecas, pode ser instrumentalizado para 'alimentar' datadog //TODO VER ISSO AQUI como funciona
// Padrão [NomeDaClasse][NomeDoMetodo] padrão de geração de log para melhor identificação ao debuggar e analisar logs, facilita manutenção
// Custos: Correto uso dos tipos de logs visando custos.
// Logar em produção somente sucessos (.log) e erros (.error), demais tipos até homol, a menos que seja identificada outra necessidade
// Este caso de uso consome do serviço de clients
// Caso de uso encapsula a camada de negócio prevista na arquitetura hexagonal
// Abstrai da implementação da camada de aplicação
// Reuso: Qualquer regra de negócio que precise BUSCAR relacionado ao cliente, se serve deste caso de uso
// Resiliência: bloco try/catch na camada de caso de uso para tratativa do comportamento da regra
// Caso de uso de busca, as trataivas de negócio são aplicadas nessa camada (ex. se um ou todos os clients)

//Framework nest, arquitura hexagonal, princípios CleanCode, otimização de custos
