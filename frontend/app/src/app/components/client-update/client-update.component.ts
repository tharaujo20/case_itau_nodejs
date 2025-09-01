import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-update.component.html',
  styleUrls: ['./client-update.component.scss'],
})
export class ClientUpdateComponent {
  id: string = '';
  name?: string;
  email?: string;
  password?: string;

  message: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(private clientService: ClientService, private router: Router) {}

  validatePassword(): boolean {
    if (!this.password) return true;
    return /^\d{4}$/.test(this.password);
  }

  updateClient(): void {
    this.message = null;
    this.errorMessage = null;

    if (!this.id) {
      this.errorMessage = 'O ID do cliente é obrigatório.';
      return;
    }

    if (!this.validatePassword()) {
      this.errorMessage =
        'A senha deve conter exatamente 4 dígitos numéricos. | Não iniciar com 0 (zero)';
      return;
    }

    const clientData: any = { id: this.id };
    if (this.name) clientData.name = this.name;
    if (this.email) clientData.email = this.email;
    if (this.password) clientData.password = Number(this.password);

    this.loading = true;
    this.clientService.updateClient(clientData).subscribe({
      next: () => {
        this.message = 'Cliente atualizado com sucesso!';
        this.errorMessage = null;
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/clientes']);
        }, 2000);
      },
      error: () => {
        this.errorMessage = 'Erro ao atualizar cliente.';
        this.loading = false;
      },
    });
  }
}
