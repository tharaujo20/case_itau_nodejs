import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
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

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if id is missing', () => {
    component.id = '';
    component.deleteClient();
    expect(component.errorMessage).toBe('O ID do cliente é obrigatório.');
    expect(component.loading).toBeFalse();
  });

  it('should delete client successfully and navigate after 2 seconds', fakeAsync(() => {
    component.id = 'uuid-123';
    mockClientService.deleteClient.and.returnValue(of(void 0));

    component.deleteClient();
    expect(component.loading).toBeTrue();

    // Avança o subscribe.next
    tick();
    fixture.detectChanges();

    expect(component.message).toBe('Cliente excluído com sucesso!');
    expect(component.errorMessage).toBeNull();
    expect(component.loading).toBeFalse();

    // Avança o setTimeout de 2s para navegar
    tick(2000);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/clientes']);
  }));

  it('should handle error on client deletion', fakeAsync(() => {
    component.id = 'uuid-123';
    mockClientService.deleteClient.and.returnValue(
      throwError(() => new Error('Erro'))
    );

    component.deleteClient();
    expect(component.loading).toBeTrue();

    // Avança o subscribe.error
    tick();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Erro ao excluir cliente.');
    expect(component.loading).toBeFalse();
  }));
});
