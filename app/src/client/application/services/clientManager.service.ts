import {
  ClientCompleteDto,
  CreateClientDto,
  DeleteClientDto,
  GetClientByIdDto,
  UpdateClientDto,
} from '../../domain/client.model';

export abstract class ClientManagerService {
  abstract findAll(): Promise<ClientCompleteDto[]>;
  abstract findOne(clientId: GetClientByIdDto): Promise<ClientCompleteDto>;
  abstract findByEmail(email: string): Promise<ClientCompleteDto | null>;
  abstract addClient(client: CreateClientDto): Promise<void>;
  abstract updateClient(updatedClient: UpdateClientDto): Promise<void>;
  abstract deleteClient(id: DeleteClientDto): Promise<void>;
}

//NOTAS DESTE ARQUIVO
//camada de abstração
//caso de uso consome deste serviço, mas não importa como o serviço consegue atendê-lo (implementação)
//desacoplamento
//tudo o que precisar de algo relacionado ao CLIENTE pode consumir do serviço de clients
