import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { CreateClientDto } from '../../domain/client.model';
import { ClientManagerService } from '../services/clientManager.service';
import { PostClientUseCase } from './postClient.useCase';

describe('PostClientUseCase', () => {
  const chance = new Chance();
  let postClientUseCase: PostClientUseCase;
  let clientService: ClientManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostClientUseCase,
        {
          provide: ClientManagerService,
          useValue: { findByEmail: jest.fn(), addClient: jest.fn() },
        },
      ],
    }).compile();

    postClientUseCase = module.get<PostClientUseCase>(PostClientUseCase);
    clientService = module.get<ClientManagerService>(ClientManagerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(postClientUseCase).toBeDefined();
    expect(clientService).toBeDefined();
  });

  it('should create a client if email does not exist', async () => {
    // Arrange
    const newClient: CreateClientDto = {
      name: chance.name(),
      email: chance.email(),
      password: chance.integer({ min: 1000, max: 9999 }),
    };
    jest.spyOn(clientService, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(clientService, 'addClient').mockResolvedValue(undefined);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    await postClientUseCase.execute(newClient);

    // Assert
    expect(clientService.findByEmail).toHaveBeenCalledWith(newClient.email);
    expect(clientService.addClient).toHaveBeenCalled();
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should throw ConflictException if client already exists', async () => {
    // Arrange
    const keyEmail = chance.email();

    const oldClient = {
      id: chance.guid(),
      name: chance.name(),
      email: keyEmail,
      balance: chance.floating({ min: 100, max: 1000 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };

    const newClient = {
      id: chance.guid(),
      name: 'newClient',
      email: keyEmail,
      balance: 0,
      password: chance.integer({ min: 1000, max: 9999 }),
    };

    jest.spyOn(clientService, 'findByEmail').mockResolvedValue(oldClient);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'error').mockImplementation();

    try {
      //Act
      await postClientUseCase.execute(newClient);
    } catch (error) {
      //Assert
      expect(clientService.findByEmail).toHaveBeenCalledWith(newClient.email);
      expect(postClientUseCase.execute(newClient)).rejects.toThrow(
        ConflictException
      );
      expect(Logger.error).toHaveBeenCalled();
    }
  });

  it('should log error and throw InternalServerErrorException on unexpected error', async () => {
    // Arrange
    const newClient = {
      id: chance.guid(),
      name: chance.name(),
      email: chance.email(),
      balance: chance.floating({ min: 100, max: 1000 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };

    const error = new Error('fail');
    jest.spyOn(clientService, 'findByEmail').mockRejectedValue(error);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'error').mockImplementation();

    // Act & Assert
    try {
      await postClientUseCase.execute(newClient);
    } catch (error) {
      expect(postClientUseCase.execute(newClient)).rejects.toThrow(
        InternalServerErrorException
      );
      expect(Logger.error).toHaveBeenCalled();
    }
  });
});
