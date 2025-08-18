import { Client } from '../../domain/client.model';

export abstract class DatabaseService {
  abstract getAll(): Promise<any[]>;
  abstract getOne(clientId: string): Promise<any>;
  abstract create(client: Client): Promise<void>;
  abstract update(clientId: string, name: string, email: string): Promise<void>;
  abstract delete(clientId: string): Promise<void>;
  abstract deposit(clientId: string, value: number): Promise<void>;
  abstract withdraw(clientId: string, value: number): Promise<void>;
}

//camada de abstração
//'gestão' de clientes consome deste serviço, mas não importa como o serviço consegue atendê-lo (implementação)
//desacoplamento
//Tudo o que precisar de algo que esteja em banco de dados, pode consumir do serviço de database
