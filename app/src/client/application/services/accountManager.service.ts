import { SafeWithdrawDto, TransactionDto } from '../../domain/account.model';
import { GetClientByIdDto } from '../../domain/client.model';

export abstract class AccountManagerService {
  abstract deposit(
    id: GetClientByIdDto,
    amount: TransactionDto
  ): Promise<number>;
  abstract withdraw(
    id: GetClientByIdDto,
    amount: SafeWithdrawDto
  ): Promise<number>;
}

//NOTAS DESTE ARQUIVO
//camada de abstração
//caso de uso consome deste serviço, mas não importa como o serviço consegue atendê-lo (implementação)
//desacoplamento
//tudo o que precisar de algo relacionado à CONTA pode consumir do serviço de clients
