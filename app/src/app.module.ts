import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientManagerService } from './client/application/services/clientManager.service';
import { DatabaseService } from './client/application/services/database.service';
import { ClientAccountController } from './client/infrastructure/controller/clientAccount.controller';
import { ClientDatabase } from './client/infrastructure/database/client.database';
import { AccountManagerServer } from './client/infrastructure/server/accountManager.server';
import { ClientManagerServer } from './client/infrastructure/server/clientManager.server';
import sqlConfig from './config/sql.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [sqlConfig],
    }),
  ],
  controllers: [ClientAccountController],
  providers: [
    Logger,
    { provide: ClientManagerService, useClass: ClientManagerServer },
    { provide: DatabaseService, useClass: ClientDatabase },
    { provide: AccountManagerServer, useClass: AccountManagerServer },
  ],
})
export class AppModule {}
