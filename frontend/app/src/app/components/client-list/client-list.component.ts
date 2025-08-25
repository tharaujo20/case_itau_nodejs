import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { Client } from '../../model/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.getClients();
  }

  getClients(): void {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = Array.isArray(data) ? data : [data];
        this.errorMessage = null;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar a lista de clientes.';
        this.loading = false;
      },
    });
  }
}
