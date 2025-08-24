import {
  ClientCompleteDto,
  CreateClientDto,
  UpdateClientDto,
} from '../../domain/client.model';

export abstract class DatabaseService {
  abstract getAll(): Promise<ClientCompleteDto[]>;
  abstract getOne(clientId: string): Promise<ClientCompleteDto>;
  abstract getByEmail(email: string): Promise<ClientCompleteDto | null>;
  abstract create(client: CreateClientDto): Promise<void>;
  abstract update(client: UpdateClientDto): Promise<void>;
  abstract delete(client: string): Promise<void>;
  abstract deposit(id: string, amount: number): Promise<void>;
  abstract withdraw(id: string, amout: number): Promise<void>;
}

//camada de abstração
//os outros consomem deste serviço, mas não importa como o serviço consegue atendê-lo (implementação)
//desacoplamento
//Tudo o que precisar de algo que esteja em banco de dados, pode consumir do serviço de database
