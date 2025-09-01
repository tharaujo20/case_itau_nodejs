import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.scss'],
})
export class ClientCreateComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  balance?: number;

  message: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(private clientService: ClientService, private router: Router) {}

  validatePassword(): boolean {
    return /^\d{4}$/.test(this.password);
  }

  createClient(): void {
    this.message = null;
    this.errorMessage = null;

    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Preencha todos os campos obrigatórios!';
      return;
    }

    if (!this.validatePassword()) {
      this.errorMessage =
        'A senha deve conter exatamente 4 dígitos numéricos. | Não iniciar com 0 (zero)';
      return;
    }

    const clientData = {
      name: this.name,
      email: this.email,
      password: Number(this.password),
      balance: this.balance,
    };

    this.loading = true;
    this.clientService.createClient(clientData).subscribe({
      next: () => {
        this.message = 'Cliente criado com sucesso!';
        this.errorMessage = null;
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/clientes']);
        }, 2000);
      },
      error: () => {
        this.errorMessage = 'Erro ao criar cliente.';
        this.loading = false;
      },
    });
  }
}
