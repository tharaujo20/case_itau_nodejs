import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  ClientCompleteDto,
  GetClientByIdDto,
  UpdateClientDto,
} from '../../domain/client.model';
import { ClientManagerService } from '../services/clientManager.service';

@Injectable()
export class UpdateClientUseCase {
  constructor(private readonly clientService: ClientManagerService) {}

  public async execute(
    id: GetClientByIdDto,
    client: UpdateClientDto
  ): Promise<void> {
    try {
      Logger.debug(
        `[UpdateClientUseCase][execute] Starting update for clientId: ${id}`
      );

      const existingClient = await this.checkIfClientExists(id);

      const updatedClient = {
        ...existingClient,
        name: client.name ?? existingClient.name,
        email: client.email ?? existingClient.email,
      };

      await this.clientService.updateClient(updatedClient);

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

  private async checkIfClientExists(
    id: GetClientByIdDto
  ): Promise<ClientCompleteDto> {
    Logger.debug(
      '[UpdateClientUseCase][checkIfClientExists] Starting to check if the client exists...'
    );
    const existingClient = await this.clientService.findOne(id);

    if (!existingClient) {
      throw new BadRequestException(`Client with id ${id} not found`);
    }

    return existingClient;
  }
}

//NOTAS DESTE ARQUIVO
//Verificação de existência primeiro: A implementação busca o cliente atual para garantir que ele existe.
//Atualização parcial: O uso de ?? garante que apenas os campos presentes no UpdateClientDto sobrescreverão os valores existentes.
