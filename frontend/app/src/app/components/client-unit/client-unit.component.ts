import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '../../model/client.model';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-unit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-unit.component.html',
  styleUrls: ['./client-unit.component.scss'],
})
export class ClientUnitComponent {
  id: string = '';
  client: Client | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;
  message: string | null = null;

  constructor(private clientService: ClientService, private route: Router) {}

  getClientById(): void {
    if (!this.id) {
      this.errorMessage = 'ID do cliente não foi fornecido.';
      return;
    }

    this.loading = true;
    this.clientService.getClientById(this.id).subscribe({
      next: (data) => {
        this.client = data;
        this.errorMessage = null;
        this.loading = false;
        this.message = 'Cliente encontrado';
      },
      error: () => {
        this.errorMessage = 'Erro ao buscar cliente.';
        this.loading = false;
      },
    });
  }
}
