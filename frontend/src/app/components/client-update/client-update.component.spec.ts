import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientUpdateComponent } from './client-update.component';
import { ClientService } from '../../services/client.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

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

  it('deve validar senha corretamente', () => {
    component.password = '1234';
    expect(component.validatePassword()).toBeTrue();

    component.password = '12';
    expect(component.validatePassword()).toBeFalse();

    component.password = undefined;
    expect(component.validatePassword()).toBeTrue(); // senha opcional
  });

  it('deve atualizar cliente com sucesso', () => {
    component.id = 'uuid-123';
    component.name = 'Maria';

    mockClientService.updateClient;
    //mockClientService.updateClient.and.returnValue(of(void 0));

    component.updateClient();

    expect(mockClientService.updateClient).toHaveBeenCalled();
    expect(component.message).toBe('Cliente atualizado com sucesso!');
  });

  it('deve mostrar erro ao falhar atualização de cliente', () => {
    component.id = 'uuid-123';
    component.name = 'Maria';

    mockClientService.updateClient.and.returnValue(
      throwError(() => new Error('Erro'))
    );

    component.updateClient();

    expect(component.errorMessage).toBe('Erro ao atualizar cliente.');
  });
});
