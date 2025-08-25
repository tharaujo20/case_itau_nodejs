import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  ClientCompleteDto,
  DeleteClientDto,
  GetClientByIdDto,
} from '../../domain/client.model';
import { ClientManagerService } from '../services/clientManager.service';

@Injectable()
export class DeleteClientUseCase {
  constructor(private readonly clientService: ClientManagerService) {}

  async execute(clientToDelete: DeleteClientDto): Promise<void> {
    try {
      Logger.debug('[DeleteClientUseCase][execute] Starting...');

      await this.checkIfClientExists(clientToDelete.id);

      await this.clientService.deleteClient(clientToDelete);

      Logger.log(
        `[DeleteClientUseCase][execute] Success: client ${clientToDelete.id} deleted`
      );
    } catch (error) {
      Logger.error(
        `[DeleteClientUseCase][execute] Error while deleting client ${clientToDelete.id}:`,
        error
      );
      throw new InternalServerErrorException(error);
    }
  }

  private async checkIfClientExists(id: string): Promise<ClientCompleteDto> {
    Logger.debug(
      '[DeleteClientUseCase][checkIfClientExists] Starting to check if the client exists...'
    );
    const existingClient = await this.clientService.findOne({
      id: id,
    } as GetClientByIdDto);

    if (!existingClient) {
      throw new BadRequestException(`Client with id ${id} not found`);
    }

    return existingClient;
  }
}
