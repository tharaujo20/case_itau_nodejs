import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import sqlite3 from 'sqlite3';
import { InitDatabase } from './init.database';

describe('InitDatabase', () => {
  let initDatabase: InitDatabase;
  let configServiceMock: Partial<ConfigService>;

  const mockRun = jest.fn();
  const mockSerialize = jest.fn((cb: Function) => cb());

  beforeEach(async () => {
    configServiceMock = {
      get: jest.fn(() => ({
        createTableClientes: `CREATE TABLE clients( id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, balance FLOAT NOT NULL DEFAULT 0, password INTEGER NOT NULL )`,
        insertClient: `INSERT INTO clients(id, name, email, balance, password) VALUES(?, ?, ?, ?, ?)`,
        selectAllClients: `SELECT * FROM clients`,
        selectClientById: `SELECT * FROM clients WHERE id = ?`,
        selectByEmail: `SELECT * FROM clients WHERE email = ?`,
        updateClient: `UPDATE clients SET name = ?, email = ?, password = ? WHERE id = ?`,
        deleteClient: `DELETE FROM clients WHERE id = ?`,
        deposit: `UPDATE clients SET balance = balance + ? WHERE id = ?`,
        withdraw: `UPDATE clients SET balance = balance - ? WHERE id = ?`,
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitDatabase,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    initDatabase = module.get<InitDatabase>(InitDatabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(initDatabase).toBeDefined();
  });

  it('should init the module creating the table and inserting client', async () => {
    //Arrange
    jest.spyOn(sqlite3, 'Database').mockImplementation(() => {
      return {
        run: mockRun,
        serialize: mockSerialize,
      } as any;
    });

    //Act
    await initDatabase.onModuleInit();

    //Assert
    expect(configServiceMock.get).toHaveBeenCalledWith('sql');
    expect(mockSerialize).toHaveBeenCalled();
    expect(mockRun).toHaveBeenCalled();
  });

  it('should call getDatabase', () => {
    // Arrange
    const spy = jest.spyOn(initDatabase, 'getDatabase');

    // Act
    initDatabase.getDatabase();

    // Assert
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSql', () => {
    // Arrange
    const spy = jest.spyOn(initDatabase, 'getSql');

    // Act
    initDatabase.getSql();

    // Assert
    expect(spy).toHaveBeenCalled();
  });
});
