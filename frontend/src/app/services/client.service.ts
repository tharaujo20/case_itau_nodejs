import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, CreateClient } from '../model/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/clientes';

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  createClient(client: CreateClient): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/novo`, client);
  }

  updateClient(client: Client): Observable<void> {
    return this.http.put<void>(this.apiUrl, client);
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deposit(id: string, amount: number): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/${id}/depositar`, { amount });
  }

  withdraw(id: string, amount: number, password: number): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/${id}/sacar`, {
      amount,
      password,
    });
  }
}
