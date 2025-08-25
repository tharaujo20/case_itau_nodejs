import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './client/client.module';
import sqlConfig from './config/sql.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [sqlConfig],
    }),
    ClientModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
