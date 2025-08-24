import { Injectable, Logger } from '@nestjs/common';
import sqlite3 from 'sqlite3';
import { DatabaseService } from '../../application/services/database.service';
import { ClientCompleteDto, UpdateClientDto } from '../../domain/client.model';
import { InitDatabase } from './init.database';

@Injectable()
export class ClientDatabase implements DatabaseService {
  constructor(private readonly initDb: InitDatabase) {}

  private get db(): sqlite3.Database {
    return this.initDb.getDatabase();
  }

  private get sql(): any {
    return this.initDb.getSql();
  }

  public async getAll(): Promise<ClientCompleteDto[]> {
    return new Promise((resolve, reject) => {
      this.db.all(this.sql.selectAllClients, [], (error, all) => {
        if (error) {
          Logger.error(
            '[ClientDatabase][getAll] Error while getting all clients',
            error
          );
          return reject(error);
        }

        Logger.log('[ClientDatabase][getAll] Clients retrieved successfully');
        resolve(all as ClientCompleteDto[]);
      });
    });
  }

  public async getOne(clientId: string): Promise<ClientCompleteDto> {
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
          `[ClientDatabase][getOne] Client ${clientId} retrieved successfully`
        );

        resolve(item as ClientCompleteDto);
      });
    });
  }

  public async getByEmail(email: string): Promise<ClientCompleteDto | null> {
    return new Promise((resolve, reject) => {
      this.db.get(this.sql.selectByEmail, [email], (error, item) => {
        if (error) {
          Logger.error(
            `[ClientDatabase][getByEmail] Error while getting the client by email ${email}`,
            error
          );
          return reject(error);
        }

        Logger.log(
          `[ClientDatabase][getByEmail] Client with email ${email} retrieved successfully`
        );

        resolve(item as ClientCompleteDto);
      });
    });
  }

  public async create(client: ClientCompleteDto): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        this.sql.insertClient,
        [client.id, client.name, client.email, client.balance, client.password],
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

  public async update(updateClient: UpdateClientDto): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        this.sql.updateClient,
        [
          updateClient.name,
          updateClient.email,
          updateClient.password,
          updateClient.id,
        ],
        function (error) {
          if (error) {
            Logger.error(
              `[ClientDatabase][update] Error while updating the client ${updateClient.id}`,
              error
            );
            return reject(error);
          }

          Logger.log(
            `[ClientDatabase][update] Client ${updateClient.id} updated successfully`
          );
          resolve();
        }
      );
    });
  }

  public async delete(client: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(this.sql.deleteClient, [client], function (error) {
        if (error) {
          Logger.error(
            `[ClientDatabase][delete] Error while deleting the client ${client}`,
            error
          );
          return reject(error);
        }

        Logger.log(
          `[ClientDatabase][delete] Client ${client} deleted successfully`
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
            `[ClientDatabase][deposit] Error while depositing`,
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
