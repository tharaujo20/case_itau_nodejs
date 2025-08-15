export abstract class DatabaseService {
  abstract getAll(): Promise<any[]>;
  abstract getOne(clientId: string): Promise<any>;
  abstract create(name: string, email: string): Promise<void>;
  abstract update(clientId: string, name: string, email: string): Promise<void>;
  abstract delete(clientId: string): Promise<void>;
  abstract deposit(clientId: string, value: number): Promise<void>;
  abstract withdraw(clientId: string, value: number): Promise<void>;
}
