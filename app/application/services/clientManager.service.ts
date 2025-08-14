export abstract class ClientManagerService {
  abstract findOne(clientID: string): Promise<any>;
  abstract findAll(): Promise<[any]>;
}

//camada de abstração
//caso de uso consome deste serviço, mas não importa como o serviço consegue atendê-lo (implementação)
//desacoplamento
//todo casos de uso que precisar de algo relacionado ao CLIENTE pode consumir do serviço de clientes
