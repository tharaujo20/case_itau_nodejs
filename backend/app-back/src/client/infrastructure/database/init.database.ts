import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import sqlite3 from 'sqlite3';

@Injectable()
export class InitDatabase implements OnModuleInit {
  private db: sqlite3.Database;
  private sql: any;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.db = new sqlite3.Database(':memory:');
    this.sql = this.configService.get<string>('sql');

    this.db.serialize(() => {
      this.db.run(this.sql.createTableClientes);
      this.db.run(this.sql.insertClient, [
        randomUUID(),
        'TESTE',
        'teste@teste.com.br',
        0,
        8765,
      ]);
    });
  }

  getDatabase(): sqlite3.Database {
    return this.db;
  }

  getSql(): any {
    return this.sql;
  }
}
