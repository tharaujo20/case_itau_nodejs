import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DeleteClientUseCase } from '../../application/useCases/deleteClient.useCase';
import { DepositValueUseCase } from '../../application/useCases/depositValue.useCase';
import { GetClientUseCase } from '../../application/useCases/getClient.useCase';
import { PostClientUseCase } from '../../application/useCases/postClient.useCase';
import { UpdateClientUseCase } from '../../application/useCases/updateClient.useCase';
import { WithdrawValueUseCase } from '../../application/useCases/withdrawValue.useCase';
import { TransactionDto } from '../../domain/account.model';
import {
  ClientCompleteDto,
  CreateClientDto,
  DeleteClientDto,
  GetClientByIdDto,
  UpdateClientDto,
} from '../../domain/client.model';

@Controller('clientes')
export class ClientAccountController {
  constructor(
    private readonly getClientUseCase: GetClientUseCase,
    private readonly postClientUseCase: PostClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase,
    private readonly depositValueUseCase: DepositValueUseCase,
    private readonly withdrawValueUseCase: WithdrawValueUseCase
  ) {}

  @Get()
  async getAllClients(): Promise<ClientCompleteDto | ClientCompleteDto[]> {
    Logger.debug(
      '[ClientAccountController][getAllClients] Calling the use case...'
    );
    return this.getClientUseCase.execute();
  }

  @Get(':id')
  async getClientById(
    @Param('id') id: GetClientByIdDto
  ): Promise<ClientCompleteDto | ClientCompleteDto[]> {
    Logger.debug(
      '[ClientAccountController][getClientById] Calling the use case...'
    );
    return this.getClientUseCase.execute(id);
  }

  @Post('/cliente')
  async postNewClient(@Body() client: CreateClientDto): Promise<void> {
    Logger.debug(
      '[ClientAccountController][postNewClient] Calling the use case...'
    );
    await this.postClientUseCase.execute(client);
  }

  @Put(':id')
  async updateClient(@Body() client: UpdateClientDto): Promise<void> {
    Logger.debug(
      '[ClientAccountController][updateClient] Calling the use case...'
    );
    await this.updateClientUseCase.execute(client);
  }

  @Delete(':id')
  async deleteClient(@Param('id') id: DeleteClientDto): Promise<void> {
    Logger.debug(
      '[ClientAccountController][deleteClient] Calling the use case...'
    );
    await this.deleteClientUseCase.execute(id);
  }

  @Post(':id/depositar')
  async depositMoney(
    @Param('id') id: GetClientByIdDto,
    @Body() amount: TransactionDto
  ): Promise<number> {
    Logger.debug(
      '[ClientAccountController][depositMoney] Calling the use case...'
    );
    return await this.depositValueUseCase.execute(id, amount);
  }

  @Post(':id/sacar')
  async withdrawMoney(
    @Param('id') id: GetClientByIdDto,
    @Body() amount: TransactionDto
  ): Promise<number> {
    Logger.debug(
      '[ClientAccountController][withdrawMoney] Calling the use case...'
    );
    return await this.withdrawValueUseCase.execute(id, amount);
  }
}

//NOTAS DESTE ARQUIVO
//Camada inicial controller
//Framework nest.js, bom uso e aceitação no mercado
//Muitas features já nativas, facilitam manutenção
//Uso de decorators adicionando 'metadados' ao código (@Get, @Controller, @Post etc), usados aqui para definir rotas e métodos HTTP para controladores.
//Aplicação entende que há um request 'Get' a ser feito, pois o nest está comunicando isso logo na entrada via decorator
//Redicerionamento para a camada de caso de uso
