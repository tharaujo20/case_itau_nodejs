import { Injectable } from '@nestjs/common';
import { ClientManagerService } from '../../application/services/clientManager.service';

@Injectable()
export class ClientManagerServer implements ClientManagerService {
  public findAll(): Promise<[any]> {
    return;
  }
  public findOne(clientID: string): Promise<any> {
    return;
  }
}
