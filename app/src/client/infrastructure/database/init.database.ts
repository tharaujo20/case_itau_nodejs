import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sqlite3 from 'sqlite3';

@Injectable()
export class InitDatabase implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  private db: sqlite3.Database;
  private sql: any;

  async onModuleInit() {
    this.db = new sqlite3.Database(':memory:');
    this.sql = this.configService.get<string>('sql');

    this.db.serialize(() => {
      this.db.run(this.sql.createTableClientes);
      this.db.run(this.sql.insertClient, ['TESTE', 'teste@teste.com.br', 0]);
    });
  }
}
