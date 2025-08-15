import { Injectable, Logger } from '@nestjs/common';
import { ClientManagerService } from '../../application/services/clientManager.service';
import { DatabaseService } from 'client/application/services/database.service';

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
}

//import {ConfigService} from '@nestjs/config'
//constructor(private readonly config ConfigSErvice){}
// ... url: `https://${this.configService.get<string>('var env file')}`
