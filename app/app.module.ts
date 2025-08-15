import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientManagerService } from '../app/client/application/services/clientManager.service';
import { DatabaseService } from '../app/client/application/services/database.service';
import { ClientAccountController } from '../app/client/infrastructure/controller/clientAccount.controller';
import { ClientDatabase } from '../app/client/infrastructure/database/client.database';
import { ClientManagerServer } from '../app/client/infrastructure/server/clientManager.server';
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
  ],
})
export class AppModule {}
