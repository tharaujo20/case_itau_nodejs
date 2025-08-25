import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import {
  ClientCompleteDto,
  ClientResult,
  GetClientByIdDto,
} from '../../domain/client.model';
import { ClientManagerService } from '../services/clientManager.service';
import { GetClientUseCase } from './getClient.useCase';

describe('GetClientUseCase', () => {
  const chance = new Chance();
  let getClientUseCase: GetClientUseCase;
  let clientService: ClientManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetClientUseCase,
        {
          provide: ClientManagerService,
          useValue: { findAll: jest.fn(), findOne: jest.fn() },
        },
      ],
    }).compile();

    getClientUseCase = module.get<GetClientUseCase>(GetClientUseCase);
    clientService = module.get<ClientManagerService>(ClientManagerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(getClientUseCase).toBeDefined();
    expect(clientService).toBeDefined();
  });

  it('should get a single client if clientId is provided', async () => {
    // Arrange
    const clientId: GetClientByIdDto = { id: chance.guid() };
    const existentClient: ClientCompleteDto = {
      id: clientId.id,
      name: chance.name(),
      email: chance.email(),
      balance: chance.floating({ min: 100, max: 1000 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };

    const clientResult: ClientResult = {
      id: clientId.id,
      name: existentClient.name,
      email: existentClient.email,
      balance: existentClient.balance,
    };

    jest.spyOn(clientService, 'findOne').mockResolvedValue(existentClient);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    const response = await getClientUseCase.execute(clientId);

    // Assert
    expect(clientService.findOne).toHaveBeenCalledWith(clientId);
    expect(response).toEqual(clientResult);
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should get all clients if clientId is not provided', async () => {
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

    const allResults: ClientResult[] = [
      {
        id: allClients[0].id,
        name: allClients[0].name,
        email: allClients[0].email,
        balance: allClients[0].balance,
      },
      {
        id: allClients[1].id,
        name: allClients[1].name,
        email: allClients[1].email,
        balance: allClients[1].balance,
      },
      {
        id: allClients[2].id,
        name: allClients[2].name,
        email: allClients[2].email,
        balance: allClients[2].balance,
      },
    ];

    jest.spyOn(clientService, 'findAll').mockResolvedValue(allClients);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    const response = await getClientUseCase.execute();

    // Assert
    expect(clientService.findAll).toHaveBeenCalled();
    expect(response).toEqual(allResults);
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should log error and throw InternalServerErrorException on failure', async () => {
    // Arrange
    const clientId: GetClientByIdDto = { id: chance.guid() };
    const error = new Error('fail');

    jest.spyOn(clientService, 'findOne').mockRejectedValue(error);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'error').mockImplementation();

    try {
      // Act
      await getClientUseCase.execute(clientId);
    } catch (error) {
      // Assert
      await expect(getClientUseCase.execute(clientId)).rejects.toThrow(
        InternalServerErrorException
      );
      expect(Logger.error).toHaveBeenCalled();
    }
  });

  it('should validate if parameter is a valid uuid', async () => {
    // Arrange
    const clientId: GetClientByIdDto = { id: chance.string() };

    // Act & Assert
    await expect(getClientUseCase.execute(clientId)).rejects.toThrow(
      `[GetClientUseCase][execute] ${clientId.id} is not a valid UUID`
    );
  });

  it('should log "Client not found" if error is instance of Error', async () => {
    // Arrange
    const clientId: GetClientByIdDto = { id: chance.guid() };
    const error = new Error('fail');

    jest.spyOn(clientService, 'findOne').mockRejectedValue(error);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'error').mockImplementation();

    // Act & Assert
    await expect(getClientUseCase.execute(clientId)).rejects.toThrow(Error);

    expect(Logger.error).toHaveBeenCalledWith(
      `Client ${clientId.id} not found`
    );
  });
});
