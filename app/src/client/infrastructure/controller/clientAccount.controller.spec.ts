import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { TransactionDto } from 'src/client/domain/account.model';
import {
  ClientCompleteDto,
  CreateClientDto,
  DeleteClientDto,
  GetClientByIdDto,
  UpdateClientDto,
} from 'src/client/domain/client.model';
import { DeleteClientUseCase } from '../../application/useCases/deleteClient.useCase';
import { DepositValueUseCase } from '../../application/useCases/depositValue.useCase';
import { GetClientUseCase } from '../../application/useCases/getClient.useCase';
import { PostClientUseCase } from '../../application/useCases/postClient.useCase';
import { UpdateClientUseCase } from '../../application/useCases/updateClient.useCase';
import { WithdrawValueUseCase } from '../../application/useCases/withdrawValue.useCase';
import { ClientAccountController } from '../controller/clientAccount.controller';

describe('ClientAccountController', () => {
  const chance = new Chance();

  let controller: ClientAccountController;
  let getClientUseCase: GetClientUseCase;
  let postClientUseCase: PostClientUseCase;
  let updateClientUseCase: UpdateClientUseCase;
  let deleteClientUseCase: DeleteClientUseCase;
  let depositValueUseCase: DepositValueUseCase;
  let withdrawValueUseCase: WithdrawValueUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientAccountController],
      providers: [
        { provide: GetClientUseCase, useValue: { execute: jest.fn() } },
        { provide: PostClientUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateClientUseCase, useValue: { execute: jest.fn() } },
        { provide: DeleteClientUseCase, useValue: { execute: jest.fn() } },
        { provide: DepositValueUseCase, useValue: { execute: jest.fn() } },
        { provide: WithdrawValueUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<ClientAccountController>(ClientAccountController);
    getClientUseCase = module.get<GetClientUseCase>(GetClientUseCase);
    postClientUseCase = module.get<PostClientUseCase>(PostClientUseCase);
    updateClientUseCase = module.get<UpdateClientUseCase>(UpdateClientUseCase);
    deleteClientUseCase = module.get<DeleteClientUseCase>(DeleteClientUseCase);
    depositValueUseCase = module.get<DepositValueUseCase>(DepositValueUseCase);
    withdrawValueUseCase =
      module.get<WithdrawValueUseCase>(WithdrawValueUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(getClientUseCase).toBeDefined();
    expect(postClientUseCase).toBeDefined();
    expect(updateClientUseCase).toBeDefined();
    expect(deleteClientUseCase).toBeDefined();
    expect(depositValueUseCase).toBeDefined();
    expect(withdrawValueUseCase).toBeDefined();
  });

  it('should get all clients', async () => {
    // Arrange
    const result: ClientCompleteDto[] = [
      {
        id: chance.guid(),
        name: chance.name(),
        email: chance.email(),
        saldo: chance.floating({ min: 1, max: 1000 }),
      },
      {
        id: chance.guid(),
        name: chance.name(),
        email: chance.email(),
        saldo: chance.floating({ min: 1, max: 1000 }),
      },
    ];

    jest.spyOn(getClientUseCase, 'execute').mockResolvedValue(result);
    jest.spyOn(Logger, 'debug').mockImplementation();

    // Act
    const response = await controller.getAllClients();

    // Assert
    expect(getClientUseCase.execute).toHaveBeenCalled();
    expect(Logger.debug).toHaveBeenCalled();
    expect(response).toBe(result);
  });

  it('should get client by id', async () => {
    // Arrange
    const id = chance.guid();
    const result: ClientCompleteDto = {
      id: chance.guid(),
      name: chance.name(),
      email: chance.email(),
      saldo: chance.floating({ min: 1, max: 1000 }),
    };

    jest.spyOn(getClientUseCase, 'execute').mockResolvedValue(result);
    jest.spyOn(Logger, 'debug').mockImplementation();

    // Act
    const response = await controller.getClientById(id);

    // Assert
    expect(getClientUseCase.execute).toHaveBeenCalledWith(id);
    expect(Logger.debug).toHaveBeenCalled();
    expect(response).toBe(result);
  });

  it('should post new client', async () => {
    // Arrange
    const client: CreateClientDto = {
      name: chance.name(),
      email: chance.email(),
    };

    jest.spyOn(postClientUseCase, 'execute').mockResolvedValue(undefined);
    jest.spyOn(Logger, 'debug').mockImplementation();

    // Act
    await controller.postNewClient(client);

    // Assert
    expect(postClientUseCase.execute).toHaveBeenCalledWith(client);
    expect(Logger.debug).toHaveBeenCalled();
  });

  it('should update client', async () => {
    //Arrange
    const client: UpdateClientDto = {
      id: chance.guid(),
      name: chance.name(),
      email: chance.email(),
    };

    jest.spyOn(updateClientUseCase, 'execute').mockResolvedValue(undefined);
    jest.spyOn(Logger, 'debug').mockImplementation();

    //Act
    await controller.updateClient(client);

    // Assert
    expect(updateClientUseCase.execute).toHaveBeenCalledWith(client);
    expect(Logger.debug).toHaveBeenCalled();
  });

  it('should delete client', async () => {
    // Arrange
    const id: DeleteClientDto = { id: chance.guid() };

    jest.spyOn(deleteClientUseCase, 'execute').mockResolvedValue(undefined);
    jest.spyOn(Logger, 'debug').mockImplementation();

    // Act
    await controller.deleteClient(id);

    // Assert
    expect(deleteClientUseCase.execute).toHaveBeenCalledWith(id);
    expect(Logger.debug).toHaveBeenCalled();
  });

  it('should deposit money', async () => {
    // Arrange
    const id: GetClientByIdDto = chance.guid();
    const amount: TransactionDto = {
      amount: chance.floating({ min: 1, max: 1000 }),
    };
    const result: number = chance.floating({ min: 1, max: 1000 });

    jest.spyOn(depositValueUseCase, 'execute').mockResolvedValue(result);
    jest.spyOn(Logger, 'debug').mockImplementation();

    // Act
    const response = await controller.depositMoney(id, amount);

    // Assert
    expect(depositValueUseCase.execute).toHaveBeenCalledWith(id, amount);
    expect(response).toBe(result);
    expect(Logger.debug).toHaveBeenCalled();
  });

  it('should withdraw money', async () => {
    // Arrange
    const id: GetClientByIdDto = chance.guid();
    const amount: TransactionDto = {
      amount: chance.floating({ min: 1, max: 1000 }),
    };
    const result: number = chance.floating({ min: 1, max: 1000 });

    jest.spyOn(withdrawValueUseCase, 'execute').mockResolvedValue(result);
    jest.spyOn(Logger, 'debug').mockImplementation();

    // Act
    const response = await controller.withdrawMoney(id, amount);

    // Assert
    expect(withdrawValueUseCase.execute).toHaveBeenCalledWith(id, amount);
    expect(response).toBe(result);
    expect(Logger.debug).toHaveBeenCalled();
  });
});
