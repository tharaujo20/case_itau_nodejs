import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ClientListComponent } from './client-list.component';
import { ClientService } from '../../services/client.service';
import { Client } from '../../model/client.model';

describe('ClientListComponent', () => {
  let component: ClientListComponent;
  let fixture: ComponentFixture<ClientListComponent>;
  let mockClientService: jasmine.SpyObj<ClientService>;

  beforeEach(async () => {
    mockClientService = jasmine.createSpyObj('ClientService', [
      'getAllClients',
    ]);

    await TestBed.configureTestingModule({
      imports: [ClientListComponent],
      providers: [{ provide: ClientService, useValue: mockClientService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientListComponent);
    component = fixture.componentInstance;
  });

  it('deve carregar clientes corretamente', () => {
    const clients: Client[] = [
      { id: '1', name: 'Maria', email: 'maria@test.com', balance: 100 },
      { id: '2', name: 'João', email: 'joao@test.com', balance: 200 },
    ];
    mockClientService.getAllClients.and.returnValue(of(clients));

    fixture.detectChanges();

    expect(component.clients.length).toBe(2);
    expect(component.errorMessage).toBeNull();
  });

  it('deve tratar erro ao carregar clientes', () => {
    mockClientService.getAllClients.and.returnValue(
      throwError(() => new Error('Erro'))
    );

    fixture.detectChanges();

    expect(component.clients.length).toBe(0);
    expect(component.errorMessage).toBe(
      'Erro ao carregar a lista de clientes.'
    );
  });
  it('deve lidar quando getAllClients retornar algo que não é array', () => {
    const clientLikeObject: any = {
      id: '1',
      name: 'Maria',
      email: 'maria@test.com',
      balance: 100,
    };

    mockClientService.getAllClients.and.returnValue(
      of(clientLikeObject as any)
    );

    fixture.detectChanges();

    expect(component.clients.length).toBe(1);
    expect(component.clients[0]).toEqual(clientLikeObject);
    expect(component.errorMessage).toBeNull();
  });
});
