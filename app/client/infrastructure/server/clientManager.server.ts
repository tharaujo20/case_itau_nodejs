import { Injectable, Logger } from '@nestjs/common';
import { ClientManagerService } from '../../application/services/clientManager.service';
import { DatabaseService } from 'client/application/services/database.service';
import { Client } from '../../domain/client.model';

@Injectable()
export class ClientManagerServer implements ClientManagerService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async findAll(): Promise<any[]> {
    try {
      Logger.debug('[ClientManagerServer][findAll] Calling method...');
      const response: any[] = await this.databaseService.getAll();

      Logger.log('[ClientManagerServer][findAll] response:', response);
      return response;
    } catch (error) {
      Logger.error(
        '[ClientManagerServer][findAll] Error while getting all clients: ',
        error
      );
      throw new Error(
        `[ClientManagerServer][findAll] Error while getting all clients: ${error}`
      );
    }
  }

  public async findOne(clientId: string): Promise<any> {
    try {
      Logger.debug('[ClientManagerServer][findOne] Calling method...');
      const response: any = await this.databaseService.getOne(clientId);

      Logger.log('[ClientManagerServer][findOne] response:', response);
      return response;
    } catch (error) {
      Logger.error(
        `[ClientManagerServer][findOne] Error while getting the client ${clientId}: `,
        error
      );
      throw new Error(
        `[ClientManagerServer][findAll] Error while getting the client ${clientId}: ${error}`
      );
    }
  }

  public async addClient(client: Client): Promise<void> {
    try {
      Logger.debug('[ClientManagerServer][addClient] Calling method...');
      const response: any = await this.databaseService.create(client);

      Logger.log('[ClientManagerServer][addClient] response:', response);
      return response;
    } catch (error) {
      Logger.error(
        `[ClientManagerServer][addClient] Error while creating the client ${client.id}: `,
        error
      );
      throw new Error(
        `[ClientManagerServer][addClient] Error while creating the client ${client.id}: ${error}`
      );
    }
  }
}

//Serve a abstração do client service, encapsulamento
//Responsabilidade única de atender ao Service de Clientes (solid)
//Separação da camada que conversa com o banco de dados
//Trata comportamentos e exceções individulamente, try/catch em cada método, facilitar debugging e análise de logs em caso de erro
//Chama serviço responsável pela camada de comunicação com banco de dados
