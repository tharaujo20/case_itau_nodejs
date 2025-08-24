import { Injectable, Logger } from '@nestjs/common';
import { ClientManagerService } from '../../application/services/clientManager.service';
import { DatabaseService } from '../../application/services/database.service';
import {
  ClientCompleteDto,
  ClientResult,
  CreateClientDto,
  DeleteClientDto,
  GetClientByIdDto,
  UpdateClientDto,
} from '../../domain/client.model';

@Injectable()
export class ClientManagerServer implements ClientManagerService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async findAll(): Promise<ClientCompleteDto[]> {
    try {
      Logger.debug('[ClientManagerServer][findAll] Calling method...');
      const response: ClientCompleteDto[] = await this.databaseService.getAll();

      Logger.log('[ClientManagerServer][findAll] response: success');
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

  public async findOne(clientId: GetClientByIdDto): Promise<ClientCompleteDto> {
    try {
      Logger.debug('[ClientManagerServer][findOne] Calling method...');
      const response: ClientCompleteDto = await this.databaseService.getOne(
        clientId.id
      );

      if (!response) {
        throw new Error(`Client ${clientId.id} not found`);
      }

      Logger.log('[ClientManagerServer][findOne] response: success');
      return response;
    } catch (error) {
      Logger.error(
        `[ClientManagerServer][findOne] Error while getting the client ${clientId.id}: `,
        error
      );
      throw new Error(
        `[ClientManagerServer][findAll] Error while getting the client ${clientId.id}: ${error}`
      );
    }
  }

  public async findByEmail(email: string): Promise<ClientCompleteDto> {
    try {
      Logger.debug('[ClientManagerServer][findByEmail] Calling method...');
      const response: ClientCompleteDto = await this.databaseService.getByEmail(
        email
      );

      Logger.log('[ClientManagerServer][findByEmail] response: success');
      return response;
    } catch (error) {
      Logger.error(
        `[ClientManagerServer][findByEmail] Error while getting by email `,
        error
      );
      throw new Error(
        `[ClientManagerServer][findByEmail] Error while getting by email: ${error}`
      );
    }
  }

  public async addClient(client: CreateClientDto): Promise<void> {
    try {
      Logger.debug('[ClientManagerServer][addClient] Calling method...');
      await this.databaseService.create(client);

      Logger.log(
        '[ClientManagerServer][addClient] New client created succesfully'
      );
    } catch (error) {
      Logger.error(
        `[ClientManagerServer][addClient] Error while creating the client: `,
        error
      );
      throw new Error(
        `[ClientManagerServer][addClient] Error while creating the client: ${error}`
      );
    }
  }

  public async updateClient(updatedClient: UpdateClientDto): Promise<void> {
    try {
      Logger.debug('[ClientManagerServer][updateClient] Calling method...');
      await this.databaseService.update(updatedClient);

      Logger.log(
        `[ClientManagerServer][updateClient] client ${updatedClient.id} updated successfully:`
      );
    } catch (error) {
      Logger.error(
        `[ClientManagerServer][updateClient] Error while creating the client ${updatedClient.id}: `,
        error
      );
      throw new Error(
        `[ClientManagerServer][updateClient] Error while creating the client ${updatedClient.id}: ${error}`
      );
    }
  }

  public async deleteClient(id: DeleteClientDto): Promise<void> {
    try {
      Logger.debug('[ClientManagerServer][deleteClient] Calling method...');
      await this.databaseService.delete(id.id);

      Logger.log(
        `[ClientManagerServer][deleteClient] client ${id.id} deleted successfully`
      );
    } catch (error) {
      Logger.error(
        `[ClientManagerServer][deleteClient] Error while creating the client ${id}: `,
        error
      );
      throw new Error(
        `[ClientManagerServer][deleteClient] Error while creating the client ${id}: ${error}`
      );
    }
  }
}

//Serve a abstração do client service, encapsulamento
//Responsabilidade única de atender ao Service de Clientes (solid)
//Separação da camada que conversa com o banco de dados
//Trata comportamentos e exceções individulamente, try/catch em cada método, facilitar debugging e análise de logs em caso de erro
//Chama serviço responsável pela camada de comunicação com banco de dados
