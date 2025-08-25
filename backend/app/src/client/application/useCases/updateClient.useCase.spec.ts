import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { ClientCompleteDto, UpdateClientDto } from '../../domain/client.model';
import { ClientManagerService } from '../services/clientManager.service';
import { UpdateClientUseCase } from './updateClient.useCase';

describe('UpdateClientUseCase', () => {
  const chance = new Chance();
  let updateClientUseCase: UpdateClientUseCase;
  let clientService: ClientManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateClientUseCase,
        {
          provide: ClientManagerService,
          useValue: { findOne: jest.fn(), updateClient: jest.fn() },
        },
      ],
    }).compile();

    updateClientUseCase = module.get<UpdateClientUseCase>(UpdateClientUseCase);
    clientService = module.get<ClientManagerService>(ClientManagerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(updateClientUseCase).toBeDefined();
    expect(clientService).toBeDefined();
  });

  it('should update name client if exists', async () => {
    // Arrange
    const id = chance.guid();
    const existingClient: ClientCompleteDto = {
      id: id,
      name: chance.name(),
      email: chance.email(),
      balance: chance.floating({ min: 100, max: 1000 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };
    const newClient: UpdateClientDto = {
      id: id,
      name: chance.name(),
    };

    jest.spyOn(clientService, 'findOne').mockResolvedValue(existingClient);
    jest.spyOn(clientService, 'updateClient').mockResolvedValue(undefined);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    await updateClientUseCase.execute(newClient);

    // Assert
    expect(clientService.findOne).toHaveBeenCalledWith({ id: newClient.id });
    expect(clientService.updateClient).toHaveBeenCalled();
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should update email client if exists', async () => {
    // Arrange
    const id = chance.guid();
    const existingClient: ClientCompleteDto = {
      id: id,
      name: chance.name(),
      email: chance.email(),
      balance: chance.floating({ min: 100, max: 1000 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };
    const newClient: UpdateClientDto = {
      id: id,
      email: chance.email(),
    };

    jest.spyOn(clientService, 'findOne').mockResolvedValue(existingClient);
    jest.spyOn(clientService, 'updateClient').mockResolvedValue(undefined);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    await updateClientUseCase.execute(newClient);

    // Assert
    expect(clientService.findOne).toHaveBeenCalledWith({ id: newClient.id });
    expect(clientService.updateClient).toHaveBeenCalled();
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should update password client if exists', async () => {
    // Arrange
    const id = chance.guid();
    const existingClient: ClientCompleteDto = {
      id: id,
      name: chance.name(),
      email: chance.email(),
      balance: chance.floating({ min: 100, max: 1000 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };
    const newClient: UpdateClientDto = {
      id: id,
      password: chance.integer({ min: 1000, max: 9999 }),
    };

    jest.spyOn(clientService, 'findOne').mockResolvedValue(existingClient);
    jest.spyOn(clientService, 'updateClient').mockResolvedValue(undefined);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    await updateClientUseCase.execute(newClient);

    // Assert
    expect(clientService.findOne).toHaveBeenCalled();
    expect(clientService.updateClient).toHaveBeenCalled();
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should throw BadRequestException if client does not exist', async () => {
    // Arrange
    const client: UpdateClientDto = {
      id: chance.guid(),
      name: chance.name(),
    };
    jest.spyOn(clientService, 'findOne').mockResolvedValue(null);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'error').mockImplementation();

    try {
      // Act
      await updateClientUseCase.execute(client);
    } catch (error) {
      //Assert
      expect(updateClientUseCase.execute(client)).rejects.toThrow(
        BadRequestException
      );
      expect(Logger.debug).toHaveBeenCalled();
      expect(Logger.error).toHaveBeenCalled();
    }
  });

  it('should log error and throw InternalServerErrorException on update error', async () => {
    // Arrange
    const client: UpdateClientDto = {
      id: chance.guid(),
      name: chance.name(),
    };

    const error = new Error('fail');

    jest.spyOn(clientService, 'findOne').mockRejectedValue(error);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'error').mockImplementation();

    try {
      // Act
      await updateClientUseCase.execute(client);
    } catch (error) {
      //Assert
      expect(updateClientUseCase.execute(client)).rejects.toThrow(
        InternalServerErrorException
      );
      expect(Logger.debug).toHaveBeenCalled();
      expect(Logger.error).toHaveBeenCalled();
    }
  });
});
