import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { TransactionDto } from 'src/client/domain/account.model';
import {
  ClientCompleteDto,
  DeleteClientDto,
  GetClientByIdDto,
  UpdateClientDto,
} from '../../domain/client.model';
import { ClientDatabase } from './client.database';
import { InitDatabase } from './init.database';

describe('ClientDatabase', () => {
  let clientDatabase: ClientDatabase;
  let initDbMock: Partial<InitDatabase>;
  const chance = new Chance();

  beforeEach(async () => {
    initDbMock = {
      getDatabase: jest.fn().mockReturnValue({
        all: jest.fn(),
        get: jest.fn(),
        run: jest.fn(),
      }),
      getSql: jest.fn().mockReturnValue({
        insertClient: `INSERT INTO clients(name, email, balance, password) VALUES(?, ?, ?, ?)`,
        selectAllClients: `SELECT * FROM clients`,
        selectClientById: `SELECT * FROM clients WHERE id = ?`,
        selectByEmail: `SELECT * FROM clients WHERE email = ?`,
        updateClient: `UPDATE clients SET name = ?, email = ?, password = ? WHERE id = ?`,
        deleteClient: `DELETE FROM clients WHERE id = ?`,
        deposit: `UPDATE clients SET balance = balance + ? WHERE id = ?`,
        withdraw: `UPDATE clients SET balance = balance - ? WHERE id = ?`,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientDatabase,
        { provide: InitDatabase, useValue: initDbMock },
      ],
    }).compile();

    clientDatabase = module.get<ClientDatabase>(ClientDatabase);
  });

  it('should be defined', () => {
    expect(clientDatabase).toBeDefined();
  });

  it('should get all clients', async () => {
    // Arrange
    const mockAll = initDbMock.getDatabase()?.all as jest.Mock;
    mockAll.mockImplementation((sql, params, callback) => {
      callback(null, [{ id: 1, name: 'Cliente Mockado' }]);
    });

    // Act
    const result = await clientDatabase.getAll();

    // Assert
    expect(result).toEqual([{ id: 1, name: 'Cliente Mockado' }]);
    expect(mockAll).toHaveBeenCalledWith(
      'SELECT * FROM clients',
      [],
      expect.any(Function)
    );
  });

  it('should reject getAll on error', async () => {
    //Arrange
    const mockAll = initDbMock.getDatabase()?.all as jest.Mock;
    mockAll.mockImplementation((sql, params, callback) => {
      callback(new Error('Database error'), null);
    });

    //Act and Assert
    await expect(clientDatabase.getAll()).rejects.toThrow('Database error');
  });

  it('should get one client by id', async () => {
    //Arrange
    const mockGet = initDbMock.getDatabase()?.get as jest.Mock;
    const id = chance.guid();
    const clientId: GetClientByIdDto = { id: id };
    mockGet.mockImplementation((sql, params, callback) => {
      callback(null, { id: id, name: 'Cliente Mockado' });
    });

    //Act
    const result = await clientDatabase.getOne(clientId);

    //Assert
    expect(result).toEqual({ id: id, name: 'Cliente Mockado' });
    expect(mockGet).toHaveBeenCalledWith(
      'SELECT * FROM clients WHERE id = ?',
      [clientId],
      expect.any(Function)
    );
  });

  it('should reject getOne on error', async () => {
    //Arrange
    const id = chance.guid();
    const mockGet = initDbMock.getDatabase()?.get as jest.Mock;
    const clientId: GetClientByIdDto = { id: id };
    mockGet.mockImplementation((sql, params, callback) => {
      callback(new Error('Database error'), null);
    });

    //Act and Assert
    await expect(clientDatabase.getOne(clientId)).rejects.toThrow(
      'Database error'
    );
  });

  it('should get client by email', async () => {
    //Arrange
    const mockGet = initDbMock.getDatabase()?.get as jest.Mock;
    const email = 'teste@teste.com';
    mockGet.mockImplementation((sql, params, callback) => {
      callback(null, { id: 1, name: 'Cliente Mockado', email });
    });

    //Act
    const result = await clientDatabase.getByEmail(email);

    //Assert
    expect(result).toEqual({ id: 1, name: 'Cliente Mockado', email });
    expect(mockGet).toHaveBeenCalledWith(
      'SELECT * FROM clients WHERE email = ?',
      [email],
      expect.any(Function)
    );
  });

  it('should reject getByEmail on error', async () => {
    //Arrange
    const mockGet = initDbMock.getDatabase()?.get as jest.Mock;
    const email = 'teste@teste.com';
    mockGet.mockImplementation((sql, params, callback) => {
      callback(new Error('Database error'), null);
    });

    //Act and Assert
    await expect(clientDatabase.getByEmail(email)).rejects.toThrow(
      'Database error'
    );
  });

  it('should create a client', async () => {
    //Arrange
    const mockRun = initDbMock.getDatabase()?.run as jest.Mock;
    const id = chance.guid();
    const client: ClientCompleteDto = {
      id: id,
      name: 'Cliente Mockado',
      email: 'teste@teste.com',
      balance: 100,
      password: 4820,
    };
    mockRun.mockImplementation((sql, params, callback) => callback(null));

    //Act and Assert
    await expect(clientDatabase.create(client)).resolves.toBeUndefined();
    expect(mockRun).toHaveBeenCalledWith(
      'INSERT INTO clients(name, email, balance, password) VALUES(?, ?, ?, ?)',
      [client.id, client.name, client.email, client.balance],
      expect.any(Function)
    );
  });

  it('should reject create on error', async () => {
    //Arrange
    const id = chance.guid();
    const mockRun = initDbMock.getDatabase()?.run as jest.Mock;
    const client: ClientCompleteDto = {
      id: id,
      name: 'Cliente Mockado',
      email: 'teste@teste.com',
      balance: 100,
      password: 4820,
    };
    mockRun.mockImplementation((sql, params, callback) =>
      callback(new Error('Database error'))
    );

    //Act and Assert
    await expect(clientDatabase.create(client)).rejects.toThrow(
      'Database error'
    );
  });

  it('should update a client', async () => {
    //Arrange
    const mockRun = initDbMock.getDatabase()?.run as jest.Mock;
    const id = chance.guid();
    const updateClient: UpdateClientDto = {
      id: id,
      name: 'Cliente Novo',
      email: 'novo@teste.com',
    };
    mockRun.mockImplementation((sql, params, callback) => callback(null));

    //Act and Assert
    await expect(clientDatabase.update(updateClient)).resolves.toBeUndefined();
    expect(mockRun).toHaveBeenCalledWith(
      'UPDATE clients SET name = ?, email = ?, password = ? WHERE id = ?',
      [updateClient.name, updateClient.email, updateClient.id],
      expect.any(Function)
    );
  });

  it('should reject update on error', async () => {
    //Arrange
    const id = chance.guid();
    const mockRun = initDbMock.getDatabase()?.run as jest.Mock;
    const updateClient: UpdateClientDto = {
      id: id,
      name: 'Cliente Novo',
      email: 'novo@teste.com',
    };
    mockRun.mockImplementation((sql, params, callback) =>
      callback(new Error('Database error'))
    );

    //Act and Assert
    await expect(clientDatabase.update(updateClient)).rejects.toThrow(
      'Database error'
    );
  });

  it('should delete a client', async () => {
    //Arrange
    const mockRun = initDbMock.getDatabase()?.run as jest.Mock;
    const id = chance.guid();
    const deleteClient: DeleteClientDto = { id: id };
    mockRun.mockImplementation((sql, params, callback) => callback(null));

    //Act and Assert
    await expect(clientDatabase.delete(deleteClient)).resolves.toBeUndefined();
    expect(mockRun).toHaveBeenCalledWith(
      'DELETE FROM clients WHERE id = ?',
      [deleteClient.id],
      expect.any(Function)
    );
  });

  it('should reject delete on error', async () => {
    //Arrange
    const id = chance.guid();
    const mockRun = initDbMock.getDatabase()?.run as jest.Mock;
    const deleteClient: DeleteClientDto = { id: id };
    mockRun.mockImplementation((sql, params, callback) =>
      callback(new Error('Database error'))
    );

    //Act and Assert
    await expect(clientDatabase.delete(deleteClient)).rejects.toThrow(
      'Database error'
    );
  });

  it('should deposit for a client', async () => {
    //Arrange
    const mockRun = initDbMock.getDatabase()?.run as jest.Mock;
    const id = chance.guid();
    const clientId: GetClientByIdDto = { id: id };
    const value: TransactionDto = { amount: 50 };
    mockRun.mockImplementation((sql, params, callback) => callback(null));

    //Act and Assert
    await expect(
      clientDatabase.deposit(clientId, value)
    ).resolves.toBeUndefined();
    expect(mockRun).toHaveBeenCalledWith(
      'UPDATE clients SET balance = balance + ? WHERE id = ?',
      [value, clientId],
      expect.any(Function)
    );
  });

  it('should reject deposit on error', async () => {
    //Arrange
    const id = chance.guid();
    const mockRun = initDbMock.getDatabase()?.run as jest.Mock;
    const clientId: GetClientByIdDto = { id: id };
    const value: TransactionDto = { amount: 50 };
    mockRun.mockImplementation((sql, params, callback) =>
      callback(new Error('Database error'))
    );

    //Act and Assert
    await expect(clientDatabase.deposit(clientId, value)).rejects.toThrow(
      'Database error'
    );
  });

  it('should withdraw from a client', async () => {
    //Arrange
    const mockRun = initDbMock.getDatabase()?.run as jest.Mock;
    const id = chance.guid();
    const clientId: GetClientByIdDto = { id: id };
    const value: TransactionDto = { amount: 50 };
    mockRun.mockImplementation((sql, params, callback) => callback(null));

    //Act and Assert
    await expect(
      clientDatabase.withdraw(clientId, value)
    ).resolves.toBeUndefined();
    expect(mockRun).toHaveBeenCalledWith(
      'UPDATE clients SET balance = balance - ? WHERE id = ?',
      [value, clientId],
      expect.any(Function)
    );
  });

  it('should reject withdraw on error', async () => {
    //Arrange
    const id = chance.guid();
    const mockRun = initDbMock.getDatabase()?.run as jest.Mock;
    const clientId: GetClientByIdDto = { id: id };
    const value: TransactionDto = { amount: 50 };
    mockRun.mockImplementation((sql, params, callback) =>
      callback(new Error('Database error'))
    );

    //Act and Assert
    await expect(clientDatabase.withdraw(clientId, value)).rejects.toThrow(
      'Database error'
    );
  });
});
