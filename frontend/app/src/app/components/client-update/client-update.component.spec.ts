import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ClientUpdateComponent } from './client-update.component';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ClientUpdateComponent', () => {
  let component: ClientUpdateComponent;
  let fixture: ComponentFixture<ClientUpdateComponent>;
  let mockClientService: jasmine.SpyObj<ClientService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockClientService = jasmine.createSpyObj('ClientService', ['updateClient']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ClientUpdateComponent],
      providers: [
        { provide: ClientService, useValue: mockClientService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('validatePassword', () => {
    it('deve retornar true para senha opcional ou válida', () => {
      component.password = '1234';
      expect(component.validatePassword()).toBeTrue();

      component.password = undefined;
      expect(component.validatePassword()).toBeTrue();
    });

    it('deve retornar false para senha inválida', () => {
      component.password = '12';
      expect(component.validatePassword()).toBeFalse();
    });
  });

  describe('updateClient', () => {
    it('deve mostrar erro se id não for fornecido', () => {
      component.id = '';
      component.updateClient();

      expect(component.errorMessage).toBe('O ID do cliente é obrigatório.');
      expect(component.loading).toBeFalse();
      expect(component.message).toBeNull();
    });

    it('deve mostrar erro se senha for inválida', () => {
      component.id = 'uuid-123';
      component.password = '12';

      component.updateClient();

      expect(component.errorMessage).toBe(
        'A senha deve conter exatamente 4 dígitos numéricos. | Não iniciar com 0 (zero)'
      );
      expect(component.loading).toBeFalse();
      expect(component.message).toBeNull();
    });

    it('deve atualizar cliente com sucesso e navegar', fakeAsync(() => {
      component.id = 'uuid-123';
      component.name = 'Maria';
      component.password = '1234';

      mockClientService.updateClient.and.returnValue(of(void 0));

      component.updateClient();

      expect(mockClientService.updateClient).toHaveBeenCalled();

      tick();
      expect(component.message).toBe('Cliente atualizado com sucesso!');
      expect(component.errorMessage).toBeNull();
      expect(component.loading).toBeFalse();

      tick(2000);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/clientes']);
    }));

    it('deve mostrar erro ao falhar atualização', () => {
      component.id = 'uuid-123';
      component.name = 'Maria';
      component.password = '1234';

      mockClientService.updateClient.and.returnValue(
        throwError(() => new Error('Erro'))
      );

      component.updateClient();

      expect(component.errorMessage).toBe('Erro ao atualizar cliente.');
      expect(component.loading).toBeFalse();
      expect(component.message).toBeNull();
    });
  });

  it('deve atualizar cliente com sucesso e navegar (com email)', fakeAsync(() => {
    component.id = 'uuid-123';
    component.name = 'Maria';
    component.email = 'maria@test.com';
    component.password = '1234';

    mockClientService.updateClient.and.returnValue(of(void 0));

    component.updateClient();

    expect(mockClientService.updateClient).toHaveBeenCalledWith({
      id: 'uuid-123',
      name: 'Maria',
      email: 'maria@test.com',
      password: 1234,
    });

    tick();
    expect(component.message).toBe('Cliente atualizado com sucesso!');
    expect(component.errorMessage).toBeNull();
    expect(component.loading).toBeFalse();

    tick(2000);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/clientes']);
  }));
});
