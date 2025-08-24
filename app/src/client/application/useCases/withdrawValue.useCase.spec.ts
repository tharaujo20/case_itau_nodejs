import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { SafeWithdrawDto } from '../../domain/account.model';
import { ClientCompleteDto, GetClientByIdDto } from '../../domain/client.model';
import { AccountManagerService } from '../services/accountManager.service';
import { ClientManagerService } from '../services/clientManager.service';
import { WithdrawValueUseCase } from './withdrawValue.useCase';

describe('WithdrawValueUseCase', () => {
  const chance = new Chance();
  let withdrawValueUseCase: WithdrawValueUseCase;
  let accountService: AccountManagerService;
  let clientService: ClientManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawValueUseCase,
        {
          provide: ClientManagerService,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: AccountManagerService,
          useValue: { withdraw: jest.fn() },
        },
      ],
    }).compile();

    withdrawValueUseCase =
      module.get<WithdrawValueUseCase>(WithdrawValueUseCase);
    accountService = module.get<AccountManagerService>(AccountManagerService);
    clientService = module.get<ClientManagerService>(ClientManagerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', async () => {
    expect(withdrawValueUseCase).toBeDefined();
    expect(accountService).toBeDefined();
    expect(clientService).toBeDefined();
  });

  it('should withdraw value if client exists and match password', async () => {
    // Arrange
    const clientId: GetClientByIdDto = { id: chance.guid() };
    const withdraw: SafeWithdrawDto = {
      amount: chance.floating({ min: 1, max: 200 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };
    const existentClient: ClientCompleteDto = {
      id: clientId.id,
      name: chance.name(),
      email: chance.email(),
      balance: chance.floating({ min: 100, max: 1000 }),
      password: withdraw.password,
    };
    const balance = existentClient.balance - withdraw.amount;

    jest.spyOn(accountService, 'withdraw').mockResolvedValue(balance);
    jest.spyOn(clientService, 'findOne').mockResolvedValue(existentClient);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    const result = await withdrawValueUseCase.execute(clientId, withdraw);

    // Assert
    expect(clientService.findOne).toHaveBeenCalledWith(clientId);
    expect(accountService.withdraw).toHaveBeenCalledWith(clientId, withdraw);
    expect(result).toBe(balance);
    expect(balance).toBeLessThan(existentClient.balance);
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should throw BadRequestException if client does not exist', async () => {
    //Arrange
    const clientId: GetClientByIdDto = { id: chance.guid() };
    const withdraw: SafeWithdrawDto = {
      amount: chance.floating({ min: 1, max: 200 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };

    jest.spyOn(accountService, 'withdraw').mockResolvedValue(undefined);
    jest.spyOn(clientService, 'findOne').mockResolvedValue(undefined);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'error').mockImplementation();

    try {
      //Act
      const result = await withdrawValueUseCase.execute(clientId, withdraw);
    } catch (error) {
      //Assert
      expect(withdrawValueUseCase.execute(clientId, withdraw)).rejects.toThrow(
        BadRequestException
      );
      expect(Logger.debug).toHaveBeenCalled();
      expect(Logger.error).toHaveBeenCalled();
    }
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    //Arrange
    const clientId: GetClientByIdDto = { id: chance.guid() };
    const existentClient: ClientCompleteDto = {
      id: clientId.id,
      name: chance.name(),
      email: chance.email(),
      balance: chance.floating({ min: 100, max: 1000 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };
    const withdraw: SafeWithdrawDto = {
      amount: chance.floating({ min: 1, max: 200 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };

    jest.spyOn(accountService, 'withdraw').mockResolvedValue(undefined);
    jest.spyOn(clientService, 'findOne').mockResolvedValue(existentClient);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'error').mockImplementation();

    try {
      //Act
      const result = await withdrawValueUseCase.execute(clientId, withdraw);
    } catch (error) {
      //Assert
      expect(withdrawValueUseCase.execute(clientId, withdraw)).rejects.toThrow(
        UnauthorizedException
      );
      expect(Logger.debug).toHaveBeenCalled();
      expect(Logger.error).toHaveBeenCalled();
    }
  });

  it('should log error and throw InternalServerErrorException on deposit error', async () => {
    //Arrange
    const clientId: GetClientByIdDto = { id: chance.guid() };
    const withdraw: SafeWithdrawDto = {
      amount: chance.floating({ min: 1, max: 200 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };
    const rejectedError = 'unknown error';

    jest.spyOn(accountService, 'withdraw').mockResolvedValue(undefined);
    jest.spyOn(clientService, 'findOne').mockRejectedValue(rejectedError);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'error').mockImplementation();

    try {
      //Act
      const result = await withdrawValueUseCase.execute(clientId, withdraw);
    } catch (error) {
      //Assert
      expect(withdrawValueUseCase.execute(clientId, withdraw)).rejects.toThrow(
        InternalServerErrorException
      );
      expect(Logger.debug).toHaveBeenCalled();
      expect(Logger.error).toHaveBeenCalled();
    }
  });
});
