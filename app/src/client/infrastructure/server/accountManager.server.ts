import { Injectable, Logger } from '@nestjs/common';
import { TransactionDto } from 'src/client/domain/account.model';
import { AccountManagerService } from '../../application/services/accountManager.service';
import { DatabaseService } from '../../application/services/database.service';
import { GetClientByIdDto } from '../../domain/client.model';

@Injectable()
export class AccountManagerServer implements AccountManagerService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async deposit(
    clientId: GetClientByIdDto,
    amount: TransactionDto
  ): Promise<number> {
    try {
      Logger.debug('[AccountManagerServer][deposit] Calling method...');
      await this.databaseService.deposit(clientId, amount);
      const newBalanceResponse = await this.databaseService.getOne(clientId);

      const updatedBalanceAccount: number = newBalanceResponse.balance;

      Logger.log('[AccountManagerServer][deposit] Deposit done successfully');
      return updatedBalanceAccount;
    } catch (error) {
      Logger.error(
        '[AccountManagerServer][deposit] Error while proccessing deposit: ',
        error
      );
      throw new Error(
        `[AccountManagerServer][deposit] Error while proccessing deposit: ${error}`
      );
    }
  }

  public async withdraw(
    clientId: GetClientByIdDto,
    amount: TransactionDto
  ): Promise<number> {
    try {
      Logger.debug('[AccountManagerServer][withdraw] Calling method...');
      await this.databaseService.withdraw(clientId, amount);
      const newBalanceResponse = await this.databaseService.getOne(clientId);

      const updatedBalanceAccount: number = newBalanceResponse.balance;

      Logger.log('[AccountManagerServer][withdraw] Withdraw done successfully');
      return updatedBalanceAccount;
    } catch (error) {
      Logger.error(
        `[AccountManagerServer][withdraw] Error while processing withdraw: `,
        error
      );
      throw new Error(
        `[ClientManagerServer][findAll] Error while processing withdraw: ${error}`
      );
    }
  }
}

//Serve a abstração do client service, encapsulamento
//Responsabilidade única de atender ao Service de Clientes (solid)
//Separação da camada que conversa com o banco de dados
//Trata comportamentos e exceções individulamente, try/catch em cada método, facilitar debugging e análise de logs em caso de erro
//Chama serviço responsável pela camada de comunicação com banco de dados
//se chegou aqui já é certeza que o cliente existe, foi validado na camada de negócio (use case)
