import {
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Chance } from 'chance';
import { DepositValueUseCase } from './depositValue.useCase';
import { AccountManagerService } from '../services/accountManager.service';
import { ClientManagerService } from '../services/clientManager.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ClientCompleteDto,
  CreateClientDto,
  GetClientByIdDto,
} from '../../domain/client.model';
import { TransactionDto } from '../../domain/account.model';

describe('DepositValueUseCase', () => {
  const chance = new Chance();
  let depositValueUseCase: DepositValueUseCase;
  let accountService: AccountManagerService;
  let clientService: ClientManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepositValueUseCase,
        {
          provide: ClientManagerService,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: AccountManagerService,
          useValue: { deposit: jest.fn() },
        },
      ],
    }).compile();

    depositValueUseCase = module.get<DepositValueUseCase>(DepositValueUseCase);
    accountService = module.get<AccountManagerService>(AccountManagerService);
    clientService = module.get<ClientManagerService>(ClientManagerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(depositValueUseCase).toBeDefined();
    expect(accountService).toBeDefined();
    expect(clientService).toBeDefined();
  });

  it('should deposit value if client exists', async () => {
    // Arrange
    const clientId: GetClientByIdDto = { id: chance.guid() };
    const amount: TransactionDto = {
      amount: chance.floating({ min: 1, max: 1000 }),
    };
    const existentClient: ClientCompleteDto = {
      id: clientId.id,
      name: chance.name(),
      email: chance.email(),
      saldo: chance.floating({ min: 100, max: 1000 }),
    };
    const balance = existentClient.saldo + amount.amount;

    jest.spyOn(accountService, 'deposit').mockResolvedValue(balance);
    jest.spyOn(clientService, 'findOne').mockResolvedValue(existentClient);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    const result = await depositValueUseCase.execute(clientId, amount);

    // Assert
    expect(clientService.findOne).toHaveBeenCalledWith(clientId);
    expect(accountService.deposit).toHaveBeenCalledWith(clientId, amount);
    expect(result).toBe(balance);
    expect(balance).toBeGreaterThan(existentClient.saldo);
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should throw BadRequestException if client does not exist', async () => {
    // Arrange
    const clientId: GetClientByIdDto = { id: chance.guid() };
    const amount: TransactionDto = {
      amount: chance.floating({ min: 1, max: 1000 }),
    };

    jest.spyOn(accountService, 'deposit').mockResolvedValue(undefined);
    jest.spyOn(clientService, 'findOne').mockResolvedValue(undefined);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'error').mockImplementation();

    try {
      // Act
      const result = await depositValueUseCase.execute(clientId, amount);
    } catch (error) {
      //Assert
      expect(depositValueUseCase.execute(clientId, amount)).rejects.toThrow(
        BadRequestException
      );
      expect(Logger.debug).toHaveBeenCalled();
      expect(Logger.error).toHaveBeenCalled();
    }
  });

  it('should log error and throw InternalServerErrorException on deposit error', async () => {
    // Arrange
    const clientId: GetClientByIdDto = { id: chance.guid() };
    const amount: TransactionDto = {
      amount: chance.floating({ min: 1, max: 1000 }),
    };
    const rejectedError = 'unknown error';

    jest.spyOn(accountService, 'deposit').mockResolvedValue(undefined);
    jest.spyOn(clientService, 'findOne').mockRejectedValue(rejectedError);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'error').mockImplementation();

    try {
      // Act
      const result = await depositValueUseCase.execute(clientId, amount);
    } catch (error) {
      //Assert
      expect(depositValueUseCase.execute(clientId, amount)).rejects.toThrow(
        InternalServerErrorException
      );
      expect(Logger.debug).toHaveBeenCalled();
      expect(Logger.error).toHaveBeenCalled();
    }
  });
});
