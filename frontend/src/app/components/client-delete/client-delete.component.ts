import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-delete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-delete.component.html',
  styleUrls: ['./client-delete.component.scss'],
})
export class ClientDeleteComponent {
  id: string = '';
  message: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(private clientService: ClientService, private router: Router) {}

  deleteClient(): void {
    this.message = null;
    this.errorMessage = null;

    if (!this.id) {
      this.errorMessage = 'O ID do cliente é obrigatório.';
      return;
    }

    this.loading = true;
    this.clientService.deleteClient(this.id).subscribe({
      next: () => {
        this.message = 'Cliente excluído com sucesso!';
        this.errorMessage = null;
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/clientes']);
        }, 2000);
      },
      error: () => {
        this.errorMessage = 'Erro ao excluir cliente.';
        this.loading = false;
      },
    });
  }
}
