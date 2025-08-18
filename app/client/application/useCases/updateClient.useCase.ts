import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientManagerService } from '../services/clientManager.service';
import { UpdateClientDto } from '../../domain/client.model';

@Injectable()
export class UpdateClientUseCase {
  constructor(private readonly clientService: ClientManagerService) {}

  public async execute(id: string, dto: UpdateClientDto): Promise<void> {
    try {
      Logger.debug(
        `[UpdateClientUseCase][execute] Starting update for clientId: ${id}`
      );

      // Get the current client to ensure it exists
      const existingClient = await this.clientService.findOne(id);
      if (!existingClient) {
        throw new InternalServerErrorException(
          `Client with id ${id} not found`
        );
      }

      // Merge updates: only update fields that are provided in dto
      const updatedClient = {
        ...existingClient,
        name: dto.name ?? existingClient.name,
        email: dto.email ?? existingClient.email,
      };

      // Call the service to update the client
      await this.clientService.updateClient(id, updatedClient);

      Logger.log(
        `[UpdateClientUseCase][execute] Success: client ${id} updated`
      );
    } catch (error) {
      Logger.error(
        `[UpdateClientUseCase][execute] Error updating client ${id}: `,
        error
      );
      throw new InternalServerErrorException(error);
    }
  }
}

//Verificação de existência primeiro: A implementação busca o cliente atual para garantir que ele existe.
//Atualização parcial: O uso de ?? garante que apenas os campos presentes no UpdateClientDto sobrescreverão os valores existentes.
