import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class TransactionDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class SecurityDto {
  @IsInt()
  @Min(1000, { message: 'A password deve ter 4 dígitos' })
  @Max(9999, { message: 'A password deve ter 4 dígitos' })
  @IsNotEmpty()
  password: number;
}
