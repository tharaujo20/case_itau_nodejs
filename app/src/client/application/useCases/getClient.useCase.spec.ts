import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import {
  ClientCompleteDto,
  GetClientByIdDto,
} from 'src/client/domain/client.model';
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
    jest.spyOn(clientService, 'findOne').mockResolvedValue(existentClient);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    const response = await getClientUseCase.execute(clientId);

    // Assert
    expect(clientService.findOne).toHaveBeenCalledWith(clientId);
    expect(response).toBe(existentClient);
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

    jest.spyOn(clientService, 'findAll').mockResolvedValue(allClients);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    const response = await getClientUseCase.execute();

    // Assert
    expect(clientService.findAll).toHaveBeenCalled();
    expect(response).toBe(allClients);
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
});
