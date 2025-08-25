import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientWithdrawComponent } from './client-withdraw.component';
import { ClientService } from '../../services/client.service';
import { of, throwError } from 'rxjs';

describe('ClientWithdrawComponent', () => {
  let component: ClientWithdrawComponent;
  let fixture: ComponentFixture<ClientWithdrawComponent>;
  let mockClientService: jasmine.SpyObj<ClientService>;

  beforeEach(async () => {
    mockClientService = jasmine.createSpyObj('ClientService', ['withdraw']);

    await TestBed.configureTestingModule({
      imports: [ClientWithdrawComponent],
      providers: [{ provide: ClientService, useValue: mockClientService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve mostrar erro se id, amount ou password não forem informados', () => {
    component.id = '';
    component.amount = null;
    component.password = null;
    component.withdraw();
    expect(component.errorMessage).toBe(
      'O ID, valor do saque e senha são obrigatórios.'
    );
  });

  it('deve mostrar erro se senha não tiver 4 dígitos', () => {
    component.id = 'uuid-123';
    component.amount = 50;
    component.password = 123;
    component.withdraw();
    expect(component.errorMessage).toBe('A senha deve ter 4 dígitos.');
  });

  it('deve realizar saque com sucesso', () => {
    component.id = 'uuid-123';
    component.amount = 100;
    component.password = 1234;
    mockClientService.withdraw.and.returnValue(of(400));

    component.withdraw();

    expect(mockClientService.withdraw).toHaveBeenCalledWith(
      'uuid-123',
      component.amount,
      component.password
    );
    expect(component.message).toBe('Saque realizado com sucesso!');
    expect(component.newBalance).toBe(400);
  });

  it('deve mostrar erro ao falhar saque', () => {
    component.id = 'uuid-123';
    component.amount = 100;
    component.password = 1234;
    mockClientService.withdraw.and.returnValue(
      throwError(() => new Error('Erro'))
    );

    component.withdraw();

    expect(component.errorMessage).toBe('Erro ao realizar saque.');
  });
});
