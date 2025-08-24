import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { DatabaseService } from '../../application/services/database.service';
import {
  ClientCompleteDto,
  CreateClientDto,
  DeleteClientDto,
  GetClientByIdDto,
  UpdateClientDto,
} from '../../domain/client.model';
import { ClientManagerServer } from './clientManager.server';

describe('ClientManagerServer', () => {
  const chance = new Chance();
  let clientManagerServer: ClientManagerServer;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientManagerServer,
        {
          provide: DatabaseService,
          useValue: {
            getAll: jest.fn(),
            getOne: jest.fn(),
            getByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            deposit: jest.fn(),
            withdraw: jest.fn(),
          },
        },
      ],
    }).compile();

    clientManagerServer = module.get<ClientManagerServer>(ClientManagerServer);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(clientManagerServer).toBeDefined();
    expect(databaseService).toBeDefined();
  });

  it('should find all clients', async () => {
    // Arrange
    const allClients: ClientCompleteDto[] = [
      {
        id: chance.guid(),
        name: chance.name(),
        email: chance.email(),
        balance: chance.floating({ min: 100, max: 1000 }),
        password: chance.integer({ min: 1000, max: 9999 }),
      },
      {
        id: chance.guid(),
        name: chance.name(),
        email: chance.email(),
        balance: chance.floating({ min: 100, max: 1000 }),
        password: chance.integer({ min: 1000, max: 9999 }),
      },
      {
        id: chance.guid(),
        name: chance.name(),
        email: chance.email(),
        balance: chance.floating({ min: 100, max: 1000 }),
        password: chance.integer({ min: 1000, max: 9999 }),
      },
    ];

    jest.spyOn(databaseService, 'getAll').mockResolvedValue(allClients);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    const result = await clientManagerServer.findAll();

    // Assert
    expect(databaseService.getAll).toHaveBeenCalled();
    expect(result).toBe(allClients);
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should log error and throw on findAll error', async () => {
    // Arrange
    const error = new Error('fail');
    jest.spyOn(databaseService, 'getAll').mockRejectedValue(error);
    jest.spyOn(Logger, 'error').mockImplementation();

    // Act & Assert
    try {
      await clientManagerServer.findAll();
    } catch (error) {
      await expect(clientManagerServer.findAll()).rejects.toThrow();
      expect(Logger.error).toHaveBeenCalled();
    }
  });

  it('should find one client', async () => {
    // Arrange
    const id: GetClientByIdDto = { id: chance.guid() };
    const client: ClientCompleteDto = {
      id: chance.guid(),
      name: chance.name(),
      email: chance.email(),
      balance: chance.floating({ min: 100, max: 1000 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };

    jest.spyOn(databaseService, 'getOne').mockResolvedValue(client);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    const result = await clientManagerServer.findOne(id);

    // Assert
    expect(databaseService.getOne).toHaveBeenCalledWith(id.id);
    expect(result).toBe(client);
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should log error and throw on findOne error', async () => {
    // Arrange
    const id: GetClientByIdDto = { id: chance.guid() };
    const error = new Error('fail');
    jest.spyOn(databaseService, 'getOne').mockRejectedValue(error);
    jest.spyOn(Logger, 'error').mockImplementation();

    // Act & Assert
    try {
      await clientManagerServer.findOne(id);
    } catch (error) {
      await expect(clientManagerServer.findOne(id)).rejects.toThrow();
      expect(Logger.error).toHaveBeenCalled();
    }
  });

  it('should log error if client would not found', async () => {
    // Arrange
    const id: GetClientByIdDto = { id: chance.guid() };
    jest.spyOn(databaseService, 'getOne').mockResolvedValue(undefined);
    jest.spyOn(Logger, 'error').mockImplementation();

    // Act & Assert
    try {
      await clientManagerServer.findOne(id);
    } catch (error) {
      await expect(clientManagerServer.findOne(id)).rejects.toThrow();
      expect(Logger.error).toHaveBeenCalled();
    }
  });

  it('should find by email', async () => {
    //Arrange
    const email: string = chance.email();
    const client: ClientCompleteDto = {
      id: chance.guid(),
      name: chance.name(),
      email: chance.email(),
      balance: chance.floating({ min: 100, max: 1000 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };

    jest.spyOn(databaseService, 'getByEmail').mockResolvedValue(client);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    const result = await clientManagerServer.findByEmail(email);

    // Assert
    expect(databaseService.getByEmail).toHaveBeenCalledWith(email);
    expect(result).toBe(client);
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should log error and throw on findByEmail error', async () => {
    // Arrange
    const email: string = chance.email();
    const error = new Error('fail');
    jest.spyOn(databaseService, 'getByEmail').mockRejectedValue(error);
    jest.spyOn(Logger, 'error').mockImplementation();

    // Act & Assert
    try {
      await clientManagerServer.findByEmail(email);
    } catch (error) {
      await expect(clientManagerServer.findByEmail(email)).rejects.toThrow();
      expect(Logger.error).toHaveBeenCalled();
    }
  });

  it('should add client', async () => {
    //Arrange
    const newClient: CreateClientDto = {
      name: chance.name(),
      email: chance.email(),
      password: chance.integer({ min: 1000, max: 9999 }),
    };

    jest.spyOn(databaseService, 'create').mockResolvedValue(undefined);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    const result = await clientManagerServer.addClient(newClient);

    // Assert
    expect(databaseService.create).toHaveBeenCalledWith(newClient);
    expect(result).toBe(undefined);
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should log error and throw on addClient error', async () => {
    //Arrange
    const newClient: CreateClientDto = {
      name: chance.name(),
      email: chance.email(),
      password: chance.integer({ min: 1000, max: 9999 }),
    };
    const error = new Error('fail');
    jest.spyOn(databaseService, 'create').mockRejectedValue(error);
    jest.spyOn(Logger, 'error').mockImplementation();

    // Act & Assert
    try {
      await clientManagerServer.addClient(newClient);
    } catch (error) {
      await expect(clientManagerServer.addClient(newClient)).rejects.toThrow();
      expect(Logger.error).toHaveBeenCalled();
    }
  });

  it('should update client', async () => {
    //Arrange
    const upClient: UpdateClientDto = {
      id: chance.guid(),
      name: chance.name(),
      email: chance.email(),
      password: chance.integer({ min: 1000, max: 9999 }),
    };

    jest.spyOn(databaseService, 'update').mockResolvedValue(undefined);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    const result = await clientManagerServer.updateClient(upClient);

    // Assert
    expect(databaseService.update).toHaveBeenCalledWith(upClient);
    expect(result).toBe(undefined);
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should log error and throw on updateClient error', async () => {
    //Arrange
    const upClient: UpdateClientDto = {
      id: chance.guid(),
      name: chance.name(),
      email: chance.email(),
      password: chance.integer({ min: 1000, max: 9999 }),
    };
    const error = new Error('fail');

    jest.spyOn(databaseService, 'update').mockRejectedValue(error);
    jest.spyOn(Logger, 'error').mockImplementation();

    // Act & Assert
    try {
      await clientManagerServer.updateClient(upClient);
    } catch (error) {
      await expect(
        clientManagerServer.updateClient(upClient)
      ).rejects.toThrow();
      expect(Logger.error).toHaveBeenCalled();
    }
  });

  it('should delete client', async () => {
    //Arrange
    const delClient: DeleteClientDto = { id: chance.guid() };

    jest.spyOn(databaseService, 'delete').mockResolvedValue(undefined);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    const result = await clientManagerServer.deleteClient(delClient);

    // Assert
    expect(databaseService.delete).toHaveBeenCalledWith(delClient.id);
    expect(result).toBe(undefined);
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should log error and throw on deleteClient error', async () => {
    //Arrange
    const delClient: DeleteClientDto = { id: chance.guid() };
    const error = new Error('fail');

    jest.spyOn(databaseService, 'delete').mockRejectedValue(error);
    jest.spyOn(Logger, 'error').mockImplementation();

    // Act & Assert
    try {
      await clientManagerServer.deleteClient(delClient);
    } catch (error) {
      await expect(
        clientManagerServer.deleteClient(delClient)
      ).rejects.toThrow();
      expect(Logger.error).toHaveBeenCalled();
    }
  });
});
