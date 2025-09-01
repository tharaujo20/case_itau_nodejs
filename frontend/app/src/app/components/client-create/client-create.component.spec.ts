import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ClientCreateComponent } from './client-create.component';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

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

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('validatePassword', () => {
    it('should return true for 4 digits', () => {
      component.password = '1234';
      expect(component.validatePassword()).toBeTrue();
    });

    it('should return false for non-4 digits', () => {
      component.password = '123';
      expect(component.validatePassword()).toBeFalse();

      component.password = '12345';
      expect(component.validatePassword()).toBeFalse();

      component.password = 'abcd';
      expect(component.validatePassword()).toBeFalse();
    });
  });

  describe('createClient', () => {
    it('should show error if required fields are missing', () => {
      component.name = '';
      component.email = '';
      component.password = '';
      component.createClient();
      expect(component.errorMessage).toBe(
        'Preencha todos os campos obrigatórios!'
      );
      expect(component.loading).toBeFalse();
    });

    it('should show error if password is invalid', () => {
      component.name = 'Test';
      component.email = 'test@test.com';
      component.password = '12';
      component.createClient();
      expect(component.errorMessage).toBe(
        'A senha deve conter exatamente 4 dígitos numéricos. | Não iniciar com 0 (zero)'
      );
      expect(component.loading).toBeFalse();
    });

    it('should create client successfully and navigate after 2 seconds', fakeAsync(() => {
      component.name = 'Test';
      component.email = 'test@test.com';
      component.password = '1234';
      component.balance = 100;

      mockClientService.createClient.and.returnValue(of(void 0));

      component.createClient();

      tick();
      fixture.detectChanges();

      expect(component.message).toBe('Cliente criado com sucesso!');
      expect(component.errorMessage).toBeNull();
      expect(component.loading).toBeFalse();

      tick(2000);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/clientes']);
    }));

    it('should handle error on client creation', fakeAsync(() => {
      component.name = 'Test';
      component.email = 'test@test.com';
      component.password = '1234';

      mockClientService.createClient.and.returnValue(
        throwError(() => new Error('Erro'))
      );

      component.createClient();

      tick();
      fixture.detectChanges();

      expect(component.errorMessage).toBe('Erro ao criar cliente.');
      expect(component.loading).toBeFalse();
    }));
  });
});
