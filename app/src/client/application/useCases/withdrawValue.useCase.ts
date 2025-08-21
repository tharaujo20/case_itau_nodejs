import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TransactionDto } from '../../domain/account.model';
import { GetClientByIdDto } from '../../domain/client.model';
import { AccountManagerService } from '../services/accountManager.service';
import { ClientManagerService } from '../services/clientManager.service';

@Injectable()
export class WithdrawValueUseCase {
  constructor(
    private readonly accountService: AccountManagerService,
    private readonly clientService: ClientManagerService
  ) {}

  public async execute(
    id: GetClientByIdDto,
    amount: TransactionDto
  ): Promise<number> {
    try {
      Logger.debug(
        `[WithdrawValueUseCase][execute] Starting withdrawing money for clientId: ${id}`
      );

      await this.checkIfClientExists(id);

      const result = await this.accountService.withdraw(id, amount);

      Logger.log(
        `[WithdrawValueUseCase][execute] Success: value ${amount} removed for client ${id}. New balance is ${result}`
      );
      return result;
    } catch (error) {
      Logger.error(
        `[WithdrawValueUseCase][execute] Error removing money for client ${id}: `,
        error
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  private async checkIfClientExists(id: GetClientByIdDto): Promise<void> {
    Logger.debug(
      '[DepositValueUSeCase][checkIfClientExists] Starting to check if the client exists...'
    );
    const existingClient = await this.clientService.findOne(id);

    if (!existingClient) {
      throw new BadRequestException(`Client with id ${id} not found`);
    }
  }
}

//NOTAS DESTE ARQUIVO
//Verificação de existência primeiro: A implementação busca o cliente atual para garantir que ele existe.
//Clean code: cada método deve ter uma única responsabilidade
//a ação de verificação é apartada em outro método para não sobrecarregar o execute
//métodos bem definidos facilitam a implementação do teste unitário
//chama serviços de cliente e de conta mas não importa como eles são implementados, contanto que atendam à necessidade
