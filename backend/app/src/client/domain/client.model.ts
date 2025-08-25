import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class GetClientByIdDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsInt()
  @Min(1000, { message: 'A senha deve ter 4 dígitos' })
  @Max(9999, { message: 'A senha deve ter 4 dígitos' })
  @IsNotEmpty()
  password: number;
}

export class UpdateClientDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsInt()
  @IsOptional()
  password?: number;
}

export class DeleteClientDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export type ClientCompleteDto = {
  id: string;
  name: string;
  email: string;
  balance: number;
  password: number;
};

export type ClientResult = {
  id: string;
  name: string;
  email: string;
  balance: number;
};

export class Adapter {
  static adapter(complete: ClientCompleteDto): ClientResult {
    return {
      id: complete.id,
      name: complete.name,
      email: complete.email,
      balance: complete.balance,
    };
  }
}
