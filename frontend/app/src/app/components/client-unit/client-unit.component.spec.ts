import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ClientUnitComponent } from './client-unit.component';
import { ClientService } from '../../services/client.service';
import { Client } from '../../model/client.model';

describe('ClientUnitComponent', () => {
  let component: ClientUnitComponent;
  let fixture: ComponentFixture<ClientUnitComponent>;
  let mockClientService: jasmine.SpyObj<ClientService>;

  beforeEach(async () => {
    mockClientService = jasmine.createSpyObj('ClientService', [
      'getClientById',
    ]);

    await TestBed.configureTestingModule({
      imports: [ClientUnitComponent],
      providers: [
        { provide: ClientService, useValue: mockClientService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', '1']]) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientUnitComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('deve mostrar erro se id não for fornecido', () => {
    component.id = '';
    component.getClientById();

    expect(component.errorMessage).toBe('ID do cliente não foi fornecido.');
    expect(component.client).toBeNull();
    expect(component.loading).toBeFalse();
    expect(component.message).toBeNull();
  });

  it('deve carregar um cliente pelo id', () => {
    const client: Client = {
      id: '1',
      name: 'Carlos',
      email: 'carlos@test.com',
      balance: 500,
    };
    component.id = '1';
    mockClientService.getClientById.and.returnValue(of(client));

    component.getClientById();

    expect(mockClientService.getClientById).toHaveBeenCalledWith('1');
    expect(component.client).toEqual(client);
    expect(component.errorMessage).toBeNull();
    expect(component.loading).toBeFalse();
    expect(component.message).toBe('Cliente encontrado');
  });

  it('deve tratar erro ao buscar cliente', () => {
    component.id = '1';
    mockClientService.getClientById.and.returnValue(
      throwError(() => new Error('Erro'))
    );

    component.getClientById();

    expect(mockClientService.getClientById).toHaveBeenCalledWith('1');
    expect(component.client).toBeNull();
    expect(component.errorMessage).toBe('Erro ao buscar cliente.');
    expect(component.loading).toBeFalse();
    expect(component.message).toBeNull();
  });
});
