import { Controller, Get, Logger, Param } from '@nestjs/common';
import { GetClientUseCase } from '../../application/useCases/getClient.useCase';

@Controller('clientes')
export class ClientAccountController {
  constructor(private readonly getClientUseCase: GetClientUseCase) {}

  @Get()
  async getAllClients(): Promise<any[]> {
    Logger.debug(
      '[ClientAccountController][getAllClients] Calling the use case'
    );
    return this.getClientUseCase.execute();
  }

  @Get(':id')
  async getClientById(@Param('id') clientId: string): Promise<any> {
    Logger.debug(
      '[ClientAccountController][getClientById] Calling the use case'
    );
    return this.getClientUseCase.execute(clientId);
  }
}

//NOTAS DESTE ARQUIVO
//Camada inicial controller
//Framework nest.js, bom uso e aceitação no mercado
//Muitas features já nativas, facilitam manutenção
//Uso de decorators adicionando 'metadados' ao código (@Get, @Controller, @Post etc), usados aqui para definir rotas e métodos HTTP para controladores.
//Aplicação entende que há um request 'Get' a ser feito, pois o nest está comunicando isso logo na entrada via decorator
