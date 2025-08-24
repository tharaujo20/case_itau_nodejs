import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { AccountManagerService } from '../../application/services/accountManager.service';
import { DatabaseService } from '../../application/services/database.service';
import { SafeWithdrawDto, TransactionDto } from '../../domain/account.model';
import { ClientCompleteDto, GetClientByIdDto } from '../../domain/client.model';
import { AccountManagerServer } from './accountManager.server';

describe('AccountManagerServer', () => {
  const chance = new Chance();
  let accountManagerServer: AccountManagerServer;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountManagerServer,
        {
          provide: AccountManagerService,
          useValue: { deposit: jest.fn(), withdraw: jest.fn() },
        },
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
    accountManagerServer =
      module.get<AccountManagerServer>(AccountManagerServer);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(accountManagerServer).toBeDefined();
    expect(databaseService).toBeDefined();
  });

  it('should deposit and return new balance', async () => {
    // Arrange
    const id = chance.guid();
    const clientId: GetClientByIdDto = { id: id };
    const oldBalance = chance.floating({ min: 1, max: 1000 });
    const deposit: TransactionDto = {
      amount: chance.floating({ min: 1, max: 1000 }),
    };
    const completeClient: ClientCompleteDto = {
      id: id,
      name: chance.name(),
      email: chance.email(),
      balance: oldBalance + deposit,
      password: chance.integer({ min: 1000, max: 9999 }),
    };

    jest.spyOn(databaseService, 'deposit').mockResolvedValue(undefined);
    jest.spyOn(databaseService, 'getOne').mockResolvedValue(completeClient);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    const result = await accountManagerServer.deposit(clientId, deposit);

    // Assert
    expect(databaseService.deposit).toHaveBeenCalledWith(
      clientId.id,
      deposit.amount
    );
    expect(databaseService.getOne).toHaveBeenCalledWith(clientId.id);
    expect(result).toBe(completeClient.balance);
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should log error and throw on deposit error', async () => {
    // Arrange
    const clientId = chance.guid();
    const amount = { amount: chance.floating({ min: 1, max: 1000 }) };
    const error = new Error('fail');
    jest.spyOn(databaseService, 'deposit').mockRejectedValue(error);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'error').mockImplementation();

    try {
      // Act
      await accountManagerServer.deposit(clientId, amount);
    } catch (error) {
      //Assert
      expect(accountManagerServer.deposit(clientId, amount)).rejects.toThrow();
      expect(Logger.error).toHaveBeenCalled();
    }
  });

  it('should withdraw and return new balance', async () => {
    // Arrange
    const id = chance.guid();
    const clientId: GetClientByIdDto = { id: id };
    const oldBalance = chance.floating({ min: 1, max: 1000 });
    const withdraw: SafeWithdrawDto = {
      amount: chance.floating({ min: 1, max: 200 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };
    const completeClient: ClientCompleteDto = {
      id: id,
      name: chance.name(),
      email: chance.email(),
      balance: oldBalance - withdraw.amount,
      password: chance.integer({ min: 1000, max: 9999 }),
    };

    jest.spyOn(databaseService, 'deposit').mockResolvedValue(undefined);
    jest.spyOn(databaseService, 'getOne').mockResolvedValue(completeClient);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'log').mockImplementation();

    // Act
    const result = await accountManagerServer.withdraw(clientId, withdraw);

    // Assert
    expect(databaseService.withdraw).toHaveBeenCalledWith(
      clientId.id,
      withdraw.amount
    );
    expect(databaseService.getOne).toHaveBeenCalledWith(clientId.id);
    expect(result).toBe(completeClient.balance);
    expect(Logger.debug).toHaveBeenCalled();
    expect(Logger.log).toHaveBeenCalled();
  });

  it('should log error and throw on withdraw error', async () => {
    // Arrange
    const clientId = chance.guid();
    const withdraw: SafeWithdrawDto = {
      amount: chance.floating({ min: 1, max: 200 }),
      password: chance.integer({ min: 1000, max: 9999 }),
    };
    const error = new Error('fail');
    jest.spyOn(databaseService, 'withdraw').mockRejectedValue(error);
    jest.spyOn(Logger, 'debug').mockImplementation();
    jest.spyOn(Logger, 'error').mockImplementation();

    try {
      // Act
      await accountManagerServer.withdraw(clientId, withdraw);
    } catch (error) {
      //Assert
      expect(
        accountManagerServer.withdraw(clientId, withdraw)
      ).rejects.toThrow();
      expect(Logger.error).toHaveBeenCalled();
    }
  });
});
