import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-withdraw',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-withdraw.component.html',
  styleUrls: ['./client-withdraw.component.scss'],
})
export class ClientWithdrawComponent {
  id: string = '';
  amount: number | null = null;
  password: number | null = null;
  message: string | null = null;
  errorMessage: string | null = null;
  newBalance: number | null = null;
  loading: boolean = false;

  constructor(private clientService: ClientService) {}

  withdraw(): void {
    this.message = null;
    this.errorMessage = null;
    this.newBalance = null;

    if (!this.id || this.amount === null || this.password === null) {
      this.errorMessage = 'O ID, valor do saque e senha são obrigatórios.';
      return;
    }

    if (this.password < 1000 || this.password > 9999) {
      this.errorMessage = 'A senha deve ter 4 dígitos.';
      return;
    }

    this.loading = true;
    this.clientService.withdraw(this.id, this.amount, this.password).subscribe({
      next: (balance: number) => {
        this.newBalance = balance;
        this.message = 'Saque realizado com sucesso!';
        this.errorMessage = null;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao realizar saque.';
        this.loading = false;
      },
    });
  }
}
