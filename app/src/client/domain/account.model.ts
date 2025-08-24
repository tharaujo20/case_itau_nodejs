import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class TransactionDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class SafeWithdrawDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsInt()
  @Min(1000, { message: 'A senha deve ter 4 dígitos' })
  @Max(9999, { message: 'A senha deve ter 4 dígitos' })
  @IsNotEmpty()
  password: number;
}
