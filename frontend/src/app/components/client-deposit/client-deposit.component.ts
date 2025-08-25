import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-deposit.component.html',
  styleUrls: ['./client-deposit.component.scss'],
})
export class ClientDepositComponent {
  id: string = '';
  amount: number | null = null;
  message: string | null = null;
  errorMessage: string | null = null;
  newBalance: number | null = null;
  loading: boolean = false;

  constructor(private clientService: ClientService) {}

  deposit(): void {
    this.message = null;
    this.errorMessage = null;
    this.newBalance = null;

    if (!this.id || !this.amount) {
      this.errorMessage =
        'O ID do cliente e o valor do depósito são obrigatórios.';
      return;
    }

    this.loading = true;
    this.clientService.deposit(this.id, this.amount).subscribe({
      next: (balance: number) => {
        this.newBalance = balance;
        this.message = 'Depósito realizado com sucesso!';
        this.errorMessage = null;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao realizar depósito.';
        this.loading = false;
      },
    });
  }
}
