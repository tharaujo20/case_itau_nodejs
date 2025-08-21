import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { ClientManagerService } from '../services/clientManager.service';
import { DeleteClientUseCase } from '../useCases/deleteClient.useCase';
import { DeleteClientDto } from '../../domain/client.model';

describe('DeleteClientUseCase', () => {
  const chance = new Chance();
  let deleteClientUseCase: DeleteClientUseCase;
  let clientService: ClientManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteClientUseCase,
        {
          provide: ClientManagerService,
          useValue: { deleteClient: jest.fn() },
        },
      ],
    }).compile();

    clientService = module.get<ClientManagerService>(ClientManagerService);
    deleteClientUseCase = module.get<DeleteClientUseCase>(DeleteClientUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', async () => {
    expect(clientService).toBeDefined();
    expect(deleteClientUseCase).toBeDefined();
  });

  it('should call deleteClient and log success', async () => {
    // Arrange
    const clientId: DeleteClientDto = { id: chance.guid() };
    jest.spyOn(clientService, 'deleteClient').mockResolvedValue(undefined);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    await deleteClientUseCase.execute(clientId);

    // Assert
    expect(clientService.deleteClient).toHaveBeenCalledWith(clientId);
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should log error and throw InternalServerErrorException on failure', async () => {
    // Arrange
    const clientId: DeleteClientDto = { id: chance.guid() };
    const error = new Error('fail');
    jest.spyOn(clientService, 'deleteClient').mockRejectedValue(error);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'error').mockImplementation();

    // Act & Assert
    try {
      await deleteClientUseCase.execute(clientId);
    } catch (error) {
      expect(deleteClientUseCase.execute(clientId)).rejects.toThrow(
        InternalServerErrorException
      );
      expect(Logger.debug).toHaveBeenCalled();
      expect(Logger.error).toHaveBeenCalled();
    }
  });
});
