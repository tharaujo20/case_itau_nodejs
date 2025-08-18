import { Client } from '../../domain/client.model';

export abstract class ClientManagerService {
  abstract findOne(clientID: string): Promise<Client>;
  abstract findAll(): Promise<Client[]>;
  abstract addClient(client: Client): Promise<void>;
}

//camada de abstração
//caso de uso consome deste serviço, mas não importa como o serviço consegue atendê-lo (implementação)
//desacoplamento
//tudo o que precisar de algo relacionado ao CLIENTE pode consumir do serviço de clientes
