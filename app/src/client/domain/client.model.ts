import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
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

export class ClientCompleteDto {
  id: string;
  name: string;
  email: string;
  balance: number;
  password: number;
}
