import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientManagerService } from '../services/clientManager.service';

@Injectable()
export class GetClientUseCase {
  constructor(private readonly clientService: ClientManagerService) {}

  public async execute(clientId?: string): Promise<any | [any]> {
    let result: any | [any];
    try {
      Logger.debug('[GetClientUseCase][execute] Starting...');

      clientId
        ? (result = this.clientService.findOne(clientId))
        : (result = this.clientService.findAll());

      Logger.log('[GetClientUseCase][execute] Success: result ', result);
      return result;
    } catch (error) {
      Logger.error(
        '[GetClientUseCase][execute] Error while getting client: ',
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
// Este caso de uso consome do serviço de busca de cliente
// Caso de uso encapsula a camada de negócio prevista na arquitetura hexagonal
// Abstrai da implementação da camada de aplicação
// Reuso: Qualquer regra de negócio que precise BUSCAR relacionado ao cliente, se serve deste caso de uso
// Resiliência: bloco try/catch na camada de caso de uso para tratativa do comportamento da regra

//Framework nest, arquitura hexagonal, princípios CleanCode, otimização de custos
