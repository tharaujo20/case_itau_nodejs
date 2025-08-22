import { TransactionDto } from '../../domain/account.model';
import {
  ClientCompleteDto,
  CreateClientDto,
  DeleteClientDto,
  GetClientByIdDto,
  UpdateClientDto,
} from '../../domain/client.model';

export abstract class DatabaseService {
  abstract getAll(): Promise<ClientCompleteDto[]>;
  abstract getOne(clientId: GetClientByIdDto): Promise<ClientCompleteDto>;
  abstract getByEmail(email: string): Promise<ClientCompleteDto | null>;
  abstract create(client: CreateClientDto): Promise<void>;
  abstract update(client: UpdateClientDto): Promise<void>;
  abstract delete(client: DeleteClientDto): Promise<void>;
  abstract deposit(id: GetClientByIdDto, amount: TransactionDto): Promise<void>;
  abstract withdraw(id: GetClientByIdDto, amout: TransactionDto): Promise<void>;
}

//camada de abstração
//os outros consomem deste serviço, mas não importa como o serviço consegue atendê-lo (implementação)
//desacoplamento
//Tudo o que precisar de algo que esteja em banco de dados, pode consumir do serviço de database
