import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DeleteClientDto } from '../../domain/client.model';
import { ClientManagerService } from '../services/clientManager.service';

@Injectable()
export class DeleteClientUseCase {
  constructor(private readonly clientService: ClientManagerService) {}

  async execute(clientId: DeleteClientDto): Promise<void> {
    try {
      Logger.debug('[DeleteClientUseCase][execute] Starting...');
      await this.clientService.deleteClient(clientId);

      Logger.log(
        `[DeleteClientUseCase][execute] Success: client ${clientId} deleted`
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
