import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientDeleteComponent } from './client-delete.component';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ClientDeleteComponent', () => {
  let component: ClientDeleteComponent;
  let fixture: ComponentFixture<ClientDeleteComponent>;
  let mockClientService: jasmine.SpyObj<ClientService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockClientService = jasmine.createSpyObj('ClientService', ['deleteClient']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ClientDeleteComponent],
      providers: [
        { provide: ClientService, useValue: mockClientService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve mostrar erro se id não for informado', () => {
    component.id = '';
    component.deleteClient();
    expect(component.errorMessage).toBe('O ID do cliente é obrigatório.');
  });

  it('deve excluir cliente com sucesso', () => {
    component.id = 'uuid-123';
    mockClientService.deleteClient.and.returnValue(of(void 0));

    component.deleteClient();

    expect(mockClientService.deleteClient).toHaveBeenCalledWith('uuid-123');
    expect(component.message).toBe('Cliente excluído com sucesso!');
  });

  it('deve mostrar erro ao falhar exclusão', () => {
    component.id = 'uuid-123';
    mockClientService.deleteClient.and.returnValue(
      throwError(() => new Error('Erro'))
    );

    component.deleteClient();

    expect(component.errorMessage).toBe('Erro ao excluir cliente.');
  });
});
