import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientCompleteDto, GetClientByIdDto } from '../../domain/client.model';
import { ClientManagerService } from '../services/clientManager.service';

@Injectable()
export class GetClientUseCase {
  constructor(private readonly clientService: ClientManagerService) {}

  public async execute(
    clientId?: GetClientByIdDto
  ): Promise<ClientCompleteDto | ClientCompleteDto[]> {
    try {
      Logger.debug('[GetClientUseCase][execute] Starting...');

      const result = clientId
        ? await this.clientService.findOne(clientId)
        : await this.clientService.findAll();

      Logger.log('[GetClientUseCase][execute] Success', result);
      return result;
    } catch (error) {
      Logger.error(
        '[GetClientUseCase][execute] Error while getting client:',
        error
      );
      throw new InternalServerErrorException(error);
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
// Reuso: Qualquer regra de negócio que precise BUSCAR relacionado ao cliente, se serve deste caso de uso
// Resiliência: bloco try/catch na camada de caso de uso para tratativa do comportamento da regra
// Caso de uso de busca, as trataivas de negócio são aplicadas nessa camada (ex. se um ou todos os clientes)

//Framework nest, arquitura hexagonal, princípios CleanCode, otimização de custos
