import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../application/services/database.service';
import sqlite3 from 'sqlite3';
import { Client } from '../../domain/client.model';

@Injectable()
export class ClientDatabase implements DatabaseService {
  private db: sqlite3.Database;
  private readonly sql: any;

  constructor(private readonly configService: ConfigService) {
    this.db = new sqlite3.Database(':memory:');
    this.sql = this.configService.get<string>('sql');

    this.db.serialize(() => {
      this.db.run(this.sql.createTableClientes);
      this.db.run(this.sql.insertClient, ['TESTE', 'teste@teste.com.br', 0]);
    });
  }

  public async getAll(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(this.sql.selectAllClients, [], (error, all) => {
        if (error) {
          Logger.error(
            '[ClientDatabase][getAll] Error while getting all clients',
            error
          );
          return reject(error);
        }

        Logger.log('[ClientDatabase][getAll] Clients retrieved sucessfully');
        resolve(all);
      });
    });
  }

  public async getOne(clientId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(this.sql.selectClientById, [clientId], (error, item) => {
        if (error) {
          Logger.error(
            `[ClientDatabase][getOne] Error while getting the client ${clientId}`,
            error
          );
          return reject(error);
        }

        Logger.log(
          `[ClientDatabase][getOne] Client ${clientId} retrieved sucessfully`
        );
        resolve(item);
      });
    });
  }

  public async create(client: Client): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        this.sql.insertClient,
        [client.id, client.name, client.email, client.saldo],
        function (error) {
          if (error) {
            Logger.error(
              '[ClientDatabase][create] Error while creating new client',
              error
            );
            return reject(error);
          }

          Logger.log(
            `[ClientDatabase][create] Client ${client.id} created successfully`
          );
          resolve();
        }
      );
    });
  }

  public async update(
    clientId: string,
    name: string,
    email: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        this.sql.updateClient,
        [name, email, clientId],
        function (error) {
          if (error) {
            Logger.error(
              `[ClientDatabase][update] Error while updating the client ${clientId}`,
              error
            );
            return reject(error);
          }

          Logger.log(
            `[ClientDatabase][update] Client ${clientId} updated successfully`
          );
          resolve();
        }
      );
    });
  }

  public async delete(clientId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(this.sql.deleteClient, [clientId], function (error) {
        if (error) {
          Logger.error(
            `[ClientDatabase][delete] Error while deleting the client ${clientId}`,
            error
          );
          return reject(error);
        }

        Logger.log(
          `[ClientDatabase][delete] Client ${clientId} deleted successfully`
        );
        resolve();
      });
    });
  }

  public async deposit(clientId: string, value: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(this.sql.deposit, [value, clientId], function (error) {
        if (error) {
          Logger.error(
            `[ClientDatabase][deposit] Error while depositing: `,
            error
          );
          return reject(error);
        }

        Logger.log('[ClientDatabase][deposit] Deposit completed successfully');
        resolve();
      });
    });
  }

  public async withdraw(clientId: string, value: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(this.sql.withdraw, [value, clientId], function (error) {
        if (error) {
          Logger.error(
            `[ClientDatabase][withdraw] Error while withdrawing`,
            error
          );
          return reject(error);
        }

        Logger.log(
          '[ClientDatabase][withdraw] Withdraw completed successfully'
        );
        resolve();
      });
    });
  }
}

//Usa configService disponibilizado no nest.js, para consumir configurações das variáveis de ambeinte
//Evita configuração hardcoded
//Serve a abstração do database service, encapsulamento
//Responsabilidade única de atender ao Service de Database (solid)
//Trata comportamentos e exceções individulamente, try/catch em cada método, facilitar debugging e análise de logs em caso de erro
//Chama serviço responsável pela camada de comunicação com banco de dados
//abordagem diferente pois o sqlite não suporta a forma do axios
