import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import sqlConfig from '../config/sql.config';
import { AccountManagerService } from './application/services/accountManager.service';
import { ClientManagerService } from './application/services/clientManager.service';
import { DatabaseService } from './application/services/database.service';
import { DeleteClientUseCase } from './application/useCases/deleteClient.useCase';
import { DepositValueUseCase } from './application/useCases/depositValue.useCase';
import { GetClientUseCase } from './application/useCases/getClient.useCase';
import { PostClientUseCase } from './application/useCases/postClient.useCase';
import { UpdateClientUseCase } from './application/useCases/updateClient.useCase';
import { WithdrawValueUseCase } from './application/useCases/withdrawValue.useCase';
import { ClientAccountController } from './infrastructure/controller/clientAccount.controller';
import { ClientDatabase } from './infrastructure/database/client.database';
import { InitDatabase } from './infrastructure/database/init.database';
import { AccountManagerServer } from './infrastructure/server/accountManager.server';
import { ClientManagerServer } from './infrastructure/server/clientManager.server';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [sqlConfig],
    }),
  ],
  controllers: [ClientAccountController],
  providers: [
    InitDatabase,
    Logger,
    GetClientUseCase,
    PostClientUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
    DepositValueUseCase,
    WithdrawValueUseCase,
    { provide: ClientManagerService, useClass: ClientManagerServer },
    { provide: DatabaseService, useClass: ClientDatabase },
    { provide: AccountManagerService, useClass: AccountManagerServer },
  ],
})
export class ClientModule {}
