import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SafeWithdrawDto, TransactionDto } from '../../domain/account.model';
import { ClientCompleteDto, GetClientByIdDto } from '../../domain/client.model';
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
    withdraw: SafeWithdrawDto
  ): Promise<number> {
    try {
      Logger.debug(
        `[WithdrawValueUseCase][execute] Starting withdrawing money for clientId: ${id.id}`
      );

      const existingClient = await this.checkIfClientExists(id);
      await this.checkPassword(existingClient, withdraw);

      const result = await this.accountService.withdraw(id, withdraw);

      Logger.log(
        `[WithdrawValueUseCase][execute] Success: value ${withdraw.amount} removed for client ${id.id}. New balance is ${result}`
      );
      return result;
    } catch (error) {
      Logger.error(
        `[WithdrawValueUseCase][execute] Error removing money for client ${id.id}: `,
        error
      );

      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  private async checkIfClientExists(
    id: GetClientByIdDto
  ): Promise<ClientCompleteDto> {
    Logger.debug(
      '[DepositValueUSeCase][checkIfClientExists] Starting to check if the client exists...'
    );
    const existingClient = await this.clientService.findOne(id);

    if (!existingClient) {
      throw new BadRequestException(`Client with id ${id} not found`);
    }

    return existingClient;
  }

  private async checkPassword(
    existingClient: ClientCompleteDto,
    password: SafeWithdrawDto
  ): Promise<boolean> {
    if (existingClient.password !== password.password) {
      throw new UnauthorizedException(
        `Client ${existingClient.id} not authorized to execute withdraw`
      );
    }

    return true;
  }
}

//NOTAS DESTE ARQUIVO
//Caso de uso encapsula a camada de negócio prevista na arquitetura hexagonal
//Verificação de existência primeiro: A implementação busca o cliente atual para garantir que ele existe.
//Verificação de password: caso a password não seja compatível, a ação de saque não será efeuada
//Clean code: cada método deve ter uma única responsabilidade
//a ação de verificação é apartada em outro método para não sobrecarregar o execute
//métodos bem definidos facilitam a implementação do teste unitário
//chama serviços de cliente e de conta mas não importa como eles são implementados, contanto que atendam à necessidade
