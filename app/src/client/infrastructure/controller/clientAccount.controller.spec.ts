// import { Logger } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';

// import { ImageManagerClient } from 'src/adapters/client/imageManager.client';
// import { StorageManagerClient } from 'src/adapters/client/storageManager.client';
// import { ImageManagerService } from 'src/adapters/services/imageManager.service';
// import { StorageManagerService } from 'src/adapters/services/storageManager.service';
// import { DeleteClientUseCase } from '../../application/useCases/deleteClient.useCase';
// import { DepositValueUseCase } from '../../application/useCases/depositValue.useCase';
// import { GetClientUseCase } from '../../application/useCases/getClient.useCase';
// import { PostClientUseCase } from '../../application/useCases/postClient.useCase';
// import { UpdateClientUseCase } from '../../application/useCases/updateClient.useCase';
// import { WithdrawValueUseCase } from '../../application/useCases/withdrawValue.useCase';
// import { AppControler } from '../imagesManager.controller';
// import { ClientAccountController } from './clientAccount.controller';
// import { ClientManagerService } from 'src/client/application/services/clientManager.service';
// import { AccountManagerService } from 'src/client/application/services/accountManager.service';
// import { DatabaseService } from 'src/client/application/services/database.service';
// import { ClientManagerServer } from '../server/clientManager.server';
// import { AccountManagerServer } from '../server/accountManager.server';
// import { ClientDatabase } from '../database/client.database';

// describe('ClientAccountController', () => {
//   let clientAccountController: ClientAccountController;
//   let getClientUseCase: GetClientUseCase;
//   let postClientUseCase: PostClientUseCase;
//   let updateClientUseCase: UpdateClientUseCase;
//   let deleteClientUseCase: DeleteClientUseCase;
//   let depositValueUseCase: DepositValueUseCase;
//   let withdrawValueUseCase: WithdrawValueUseCase;
//   let clientManagerService: ClientManagerService;
//   let accountManagerService: AccountManagerService;
//   let databaseService: DatabaseService;

//   beforeEach(async () => {
//     const app: TestingModule = await Test.createTestingModule({
//       controllers: [ClientAccountController],
//       providers: [
//         Logger,
//         { provide: ClientManagerService, useValue: ClientManagerServer },
//         { provide: AccountManagerService, useValue: AccountManagerServer },
//         { provide: DatabaseService, useValue: ClientDatabase },
//       ],
//     }).compile();

//     clientAccountController = app.get<ClientAccountController>(
//       ClientAccountController
//     );
//     clientManagerService = app.get<ClientManagerService>(ClientManagerService);
//     accountManagerService = app.get<AccountManagerService>(
//       AccountManagerService
//     );
//     databaseService = app.get<DatabaseService>(DatabaseService);
//   });

//   it('should be defined', async () => {
//     // //Arrange
//     // const imageToBePosted = {
//     //   title: 'tiger',
//     //   description: 'this is a beautiful tiger',
//     //   tags: ['cat', 'wild', 'tiger'],
//     //   owner: 'owner',
//     // };
//     // const register = {
//     //   id: 'string',
//     //   name: imageToBePosted.title,
//     //   description: imageToBePosted.description,
//     //   type: 'string',
//     //   size: 'string',
//     //   imagePath: 'string',
//     //   tags: imageToBePosted.tags,
//     //   owner: imageToBePosted.owner,
//     //   status: 'string',
//     //   createdAt: 'string',
//     //   updatedAt: 'string',
//     // };

//     // const expected = `Item ${register} added into storage succesfully`;

//     // //Act
//     // const result = await appControler.postImages(imageToBePosted);

//     //Assert
//     expect(clientAccountController).toBeDefined();
//     expect(clientManagerService).toBeDefined();
//     expect(accountManagerService).toBeDefined();
//     expect(databaseService).toBeDefined();
//   });

//   //   it('should get an image by id', () => {});

//   //   it('should get all images', () => {});

//   //   it('should delete an image by id', () => {});

//   //   it('should delete all images', () => {});
// });
