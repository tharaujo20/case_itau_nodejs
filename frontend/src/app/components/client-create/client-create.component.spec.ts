import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientCreateComponent } from './client-create.component';
import { ClientService } from '../../services/client.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('ClientCreateComponent', () => {
  let component: ClientCreateComponent;
  let fixture: ComponentFixture<ClientCreateComponent>;
  let mockClientService: jasmine.SpyObj<ClientService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockClientService = jasmine.createSpyObj('ClientService', ['createClient']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ClientCreateComponent],
      providers: [
        { provide: ClientService, useValue: mockClientService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve validar senha com 4 dígitos corretamente', () => {
    component.password = '1234';
    expect(component.validatePassword()).toBeTrue();

    component.password = '123';
    expect(component.validatePassword()).toBeFalse();

    component.password = 'abcd';
    expect(component.validatePassword()).toBeFalse();
  });

  it('deve criar cliente com sucesso', () => {
    component.name = 'Ana';
    component.email = 'ana@test.com';
    component.password = '1234';

    mockClientService.createClient;
    //mockClientService.createClient;.and.returnValue(of(void));

    component.createClient();

    expect(mockClientService.createClient).toHaveBeenCalled();
    expect(component.message).toBe('Cliente criado com sucesso!');
  });

  it('deve mostrar erro ao falhar criação de cliente', () => {
    component.name = 'Ana';
    component.email = 'ana@test.com';
    component.password = '1234';

    mockClientService.createClient.and.returnValue(
      throwError(() => new Error('Erro'))
    );

    component.createClient();

    expect(component.errorMessage).toBe('Erro ao criar cliente.');
  });
});
