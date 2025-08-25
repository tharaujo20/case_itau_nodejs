import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientDepositComponent } from './client-deposit.component';
import { ClientService } from '../../services/client.service';
import { of, throwError } from 'rxjs';

describe('ClientDepositComponent', () => {
  let component: ClientDepositComponent;
  let fixture: ComponentFixture<ClientDepositComponent>;
  let mockClientService: jasmine.SpyObj<ClientService>;

  beforeEach(async () => {
    mockClientService = jasmine.createSpyObj('ClientService', ['deposit']);

    await TestBed.configureTestingModule({
      imports: [ClientDepositComponent],
      providers: [{ provide: ClientService, useValue: mockClientService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve mostrar erro se id ou amount não forem informados', () => {
    component.id = '';
    component.amount = null;
    component.deposit();
    expect(component.errorMessage).toBe(
      'O ID do cliente e o valor do depósito são obrigatórios.'
    );
  });

  it('deve realizar depósito com sucesso', () => {
    component.id = 'uuid-123';
    component.amount = 100;
    mockClientService.deposit.and.returnValue(of(500));

    component.deposit();

    expect(mockClientService.deposit).toHaveBeenCalledWith('uuid-123', {
      amount: 100,
    });
    expect(component.message).toBe('Depósito realizado com sucesso!');
    expect(component.newBalance).toBe(500);
  });

  it('deve mostrar erro ao falhar depósito', () => {
    component.id = 'uuid-123';
    component.amount = 100;
    mockClientService.deposit.and.returnValue(
      throwError(() => new Error('Erro'))
    );

    component.deposit();

    expect(component.errorMessage).toBe('Erro ao realizar depósito.');
  });
});
