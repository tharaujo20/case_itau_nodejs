import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Logger,
} from '@nestjs/common';
import { GetClientUseCase } from '../../application/useCases/getClient.useCase';
import { PostClientUseCase } from '../../application/useCases/postClient.useCase';
import { UpdateClientUseCase } from '../../application/useCases/updateClient.useCase';
import { CreateClientDto } from '../../domain/client.model';
import { UpdateClientDto } from '../../domain/client.model';
import { ClientResponseDto } from '../../domain/client.model';

@Controller('clientes')
export class ClientAccountController {
  constructor(
    private readonly getClientUseCase: GetClientUseCase,
    private readonly postClientUseCase: PostClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase
  ) {}

  @Get()
  async getAllClients(): Promise<ClientResponseDto[]> {
    Logger.debug(
      '[ClientAccountController][getAllClients] Calling the use case...'
    );
    return this.getClientUseCase.execute();
  }

  @Get(':id')
  async getClientById(@Param('id') id: string): Promise<ClientResponseDto> {
    Logger.debug(
      '[ClientAccountController][getClientById] Calling the use case...'
    );
    return this.getClientUseCase.execute(id);
  }

  @Post('/cliente')
  async postNewClient(@Body() dto: CreateClientDto): Promise<void> {
    Logger.debug(
      '[ClientAccountController][postNewClient] Calling the use case...'
    );
    return this.postClientUseCase.execute(dto.name, dto.email);
  }

  @Put(':id')
  async updateClient(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto
  ): Promise<void> {
    Logger.debug(
      '[ClientAccountController][updateClient] Calling the use case...'
    );
    return this.updateClientUseCase.execute(id, dto);
  }
}

//NOTAS DESTE ARQUIVO
//Camada inicial controller
//Framework nest.js, bom uso e aceitação no mercado
//Muitas features já nativas, facilitam manutenção
//Uso de decorators adicionando 'metadados' ao código (@Get, @Controller, @Post etc), usados aqui para definir rotas e métodos HTTP para controladores.
//Aplicação entende que há um request 'Get' a ser feito, pois o nest está comunicando isso logo na entrada via decorator
//Redicerionamento para a camada de caso de uso
