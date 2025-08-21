import {
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Chance } from 'chance';
import { UpdateClientUseCase } from './updateClient.useCase';
import { ClientManagerService } from '../services/clientManager.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ClientCompleteDto,
  UpdateClientDto,
} from 'src/client/domain/client.model';

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

  it('should update client if exists', async () => {
    // Arrange
    const id = chance.guid();
    const existingClient: ClientCompleteDto = {
      id: id,
      name: chance.name(),
      email: chance.email(),
      saldo: chance.floating({ min: 100, max: 1000 }),
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
    expect(clientService.findOne).toHaveBeenCalledWith(newClient.id);
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
